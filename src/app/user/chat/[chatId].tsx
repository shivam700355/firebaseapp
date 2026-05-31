import { CustomButton } from "@/components/CustomButton";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getChatDetails, sendMessage, subscribeToMessages } from "@/services/chatService";
import { formatTimestamp } from "@/utils/format";
import type { MessageItem } from "@/utils/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

export default function UserChatDetail() {
  const { ready, user } = useProtectedRoute("user");
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState("");
  const [chatLabel, setChatLabel] = useState("Chat");

  useEffect(() => {
    if (!chatId || !ready) return;

    const unsubscribe = subscribeToMessages(chatId, setMessages);

    getChatDetails(chatId).then((chat) => {
      if (chat && user) {
        const partnerIds = chat.participants.filter((id) => id !== user.uid);
        setChatLabel(partnerIds.length === 1 ? partnerIds[0] : "Conversation");
      }
    });

    return unsubscribe;
  }, [chatId, ready, user]);

  const handleSend = async () => {
    if (!chatId || !user || !text.trim()) return;
    await sendMessage(chatId, user.uid, text.trim());
    setText("");
  };

  if (!ready) {
    return null;
  }

  return (
    <ScreenWrapper>
      <Header title={chatLabel} subtitle="Send updates and messages in real time." />
      <View style={styles.messages}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageBubble, message.senderId === user?.uid ? styles.outgoing : styles.incoming]}>
            <Text style={[styles.messageText, message.senderId === user?.uid ? styles.outgoingText : styles.incomingText]}>{message.text}</Text>
            <Text style={styles.messageTime}>{formatTimestamp(message.createdAt)}</Text>
          </View>
        ))}
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inputRow}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Write a message" placeholderTextColor="#9CA3AF" />
        <CustomButton title="Send" onPress={handleSend} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  messages: {
    flex: 1,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    maxWidth: "85%",
  },
  incoming: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
  },
  outgoing: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 15,
    marginBottom: 8,
  },
  incomingText: {
    color: "#111827",
  },
  outgoingText: {
    color: "#fff",
  },
  messageTime: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "right",
  },
  inputRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    color: "#111827",
  },
});
