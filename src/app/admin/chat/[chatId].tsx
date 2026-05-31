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

    getChatDetails(chatId).then((chat) => {
      if (chat && user) {
        const partnerIds = chat.participants.filter((id) => id !== user.uid);
        setChatLabel(partnerIds.length === 1 ? partnerIds[0] : "Group Chat");
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

  return (
    <ScreenWrapper>
      <Header title={chatLabel} subtitle="One-to-one chat" />
      <View style={styles.messages}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageBubble, message.senderId === user?.uid ? styles.messageOutgoing : styles.messageIncoming]}>
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>{formatTimestamp(message.createdAt)}</Text>
          </View>
        ))}
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inputRow}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Type a message" placeholderTextColor="#9CA3AF" />
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
    padding: 14,
    borderRadius: 18,
    maxWidth: "85%",
    marginBottom: 12,
  },
  messageIncoming: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
  },
  messageOutgoing: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#111827",
    fontSize: 15,
    marginBottom: 6,
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
