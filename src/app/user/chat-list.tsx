import { ChatCard } from "@/components/ChatCard";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { fetchUserChats } from "@/services/chatService";
import { getUserProfile } from '@/services/userService';
import type { ChatItem } from "@/utils/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function UserChatList() {
  const { ready, user } = useProtectedRoute("user");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [namesMap, setNamesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      setLoading(true);
      const results = await fetchUserChats(user.uid);
      setChats(results);
      // build name map for participants
      const ids = new Set<string>();
      results.forEach((c) => c.participants.forEach((id) => ids.add(id)));
      ids.delete(user.uid);
      const idArray = Array.from(ids);
      const profiles = await Promise.all(idArray.map((id) => getUserProfile(id)));
      const map: Record<string, string> = {};
      idArray.forEach((id, i) => {
        map[id] = profiles[i]?.name || id;
      });
      setNamesMap(map);
      setLoading(false);
    };

    if (ready) {
      loadChats();
    }
  }, [ready, user]);

  const getLabel = (chat: ChatItem) => {
    const participants = chat.participants.filter((id) => id !== user?.uid);
    if (participants.length === 0) return "Conversation";
    return participants.map((id) => namesMap[id] || id).join(', ');
  };

  const totalUnread = chats.reduce((sum, chat) => sum + (user ? chat.unread?.[user.uid] ?? 0 : 0), 0);

  return (
    <ScreenWrapper>
      <Header title="Messages" subtitle="Recent conversations appear here." profileLink="/user/profile" />
      <View style={styles.list}>
        {chats.length === 0 ? (
          <EmptyState title="No messages" description="Start a new chat from the user list." />
        ) : (
          chats.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              participantsLabel={getLabel(chat)}
              unreadCount={user ? chat.unread?.[user.uid] ?? 0 : 0}
              onPress={() => router.push({ pathname: "/user/chat/[chatId]", params: { chatId: chat.id } })}
            />
          ))
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
});
