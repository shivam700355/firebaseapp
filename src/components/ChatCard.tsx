import { COLORS } from '@/theme';
import { createMessagePreview, formatTimestamp } from "@/utils/format";
import type { ChatItem } from "@/utils/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  chat: ChatItem;
  onPress: () => void;
  participantsLabel: string;
  unreadCount?: number;
}

export function ChatCard({ chat, onPress, participantsLabel, unreadCount = 0 }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leftBlock}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{participantsLabel.split(',')[0]?.trim().charAt(0) ?? 'U'}</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{participantsLabel}</Text>
          <Text style={styles.subtitle}>{createMessagePreview({ text: chat.lastMessage, senderId: "", createdAt: chat.updatedAt })}</Text>
        </View>
      </View>
      <View style={styles.rightBlock}>
        <View style={styles.timeBadge}>
          <Text style={styles.time}>{formatTimestamp(chat.updatedAt)}</Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 18,
  },
  rightBlock: {
    alignItems: "flex-end",
    justifyContent: "center",
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
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  unreadBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  time: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
});
