import { createMessagePreview, formatTimestamp } from "@/utils/format";
import type { ChatItem } from "@/utils/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  chat: ChatItem;
  onPress: () => void;
  participantsLabel: string;
}

export function ChatCard({ chat, onPress, participantsLabel }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{participantsLabel}</Text>
        <Text style={styles.subtitle}>{createMessagePreview({ text: chat.lastMessage, senderId: "", createdAt: chat.updatedAt })}</Text>
      </View>
      <View style={styles.timeBadge}>
        <Text style={styles.time}>{formatTimestamp(chat.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
  },
  timeBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#E5E7EB",
  },
  time: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
  },
});
