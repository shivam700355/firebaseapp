import { CustomButton } from "@/components/CustomButton";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getChatDetails, markChatRead, sendMessage, subscribeToMessages } from "@/services/chatService";
import { getUserProfile } from '@/services/userService';
import { COLORS, SIZES } from '@/theme';
import { formatTimestamp } from "@/utils/format";
import type { MessageItem } from "@/utils/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

export default function AdminChatDetail() {
  const { ready, user } = useProtectedRoute("admin");
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState("");
  const [chatLabel, setChatLabel] = useState("Conversation");

  useEffect(() => {
    if (!chatId || !ready) return;

    const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
    });

    if (user) {
      markChatRead(chatId, user.uid).catch(() => null);
    }

    getChatDetails(chatId).then(async (chat) => {
      if (chat && user) {
        const partnerIds = chat.participants.filter((id) => id !== user.uid);
        if (partnerIds.length === 1) {
          const profile = await getUserProfile(partnerIds[0]);
          setChatLabel(profile?.name || partnerIds[0]);
        } else if (partnerIds.length > 1) {
          const names = await Promise.all(partnerIds.map((id) => getUserProfile(id).then((p) => p?.name || id)));
          setChatLabel(names.join(', '));
        } else {
          setChatLabel('Conversation');
        }
      }
    });

    return unsubscribe;
  }, [chatId, ready, user]);

  const handleSend = async () => {
    if (!text.trim() || !chatId || !user) return;
    await sendMessage(chatId, user.uid, text.trim());
    setText("");
  };

  if (!ready) {
    return null;
  }
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Header
        leftAction={<CustomButton title="Back" onPress={() => router.back()} variant="ghost" />}
        title={chatLabel}
        subtitle="One-to-one chat"
        rightAction={<CustomButton title="Inbox" onPress={() => router.push('/admin/chat-list')} variant="secondary" />}
      />
      <View style={styles.chatContainer}>
        <View style={styles.messages}>
          {messages.map((message) => (
            <View key={message.id} style={[styles.messageBubble, message.senderId === user?.uid ? styles.messageOutgoing : styles.messageIncoming]}>
              <Text style={[styles.messageText, message.senderId === user?.uid ? styles.outgoingText : styles.incomingText]}>{message.text}</Text>
              <Text style={styles.messageTime}>{formatTimestamp(message.createdAt)}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.bottomRow}>
        <CustomButton title="Back" onPress={() => router.back()} variant="secondary" style={{ flex: 1, marginRight: 8 }} />
        <CustomButton title="Inbox" onPress={() => router.push('/admin/chat-list')} variant="ghost" style={{ flex: 1, marginLeft: 8 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inputRow}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Type a message" placeholderTextColor="#9CA3AF" />
        <CustomButton title="Send" onPress={handleSend} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    width: '100%',
    maxWidth: SIZES.containerWidth,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  messages: {
    flex: 1,
    paddingVertical: SIZES.spacing / 2,
    gap: 8,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '80%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  messageIncoming: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
  },
  messageOutgoing: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 15,
    marginBottom: 8,
  },
  incomingText: {
    color: COLORS.text,
  },
  outgoingText: {
    color: '#fff',
  },
  messageTime: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'right',
  },
  inputRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: SIZES.containerWidth,
    alignSelf: 'center',
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  bottomRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
});
