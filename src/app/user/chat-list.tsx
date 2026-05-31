import { ChatCard } from "@/components/ChatCard";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { fetchUserChats } from "@/services/chatService";
import type { ChatItem } from "@/utils/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function UserChatList() {
  const { ready, user } = useProtectedRoute("user");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      setLoading(true);
      const results = await fetchUserChats(user.uid);
      setChats(results);
      setLoading(false);
    };

    if (ready) {
      loadChats();
    }
  }, [ready, user]);

  const getLabel = (chat: ChatItem) => {
    const participants = chat.participants.filter((id) => id !== user?.uid);
    return participants.length > 0 ? participants.join(", ") : "Conversation";
  };

  return (
    <ScreenWrapper>
      <Header title="Messages" subtitle="Recent conversations appear here." />
      <View style={styles.list}>
        {chats.length === 0 ? (
          <EmptyState title="No messages" description="Start a new chat from the user list." />
        ) : (
          chats.map((chat) => (
            <ChatCard key={chat.id} chat={chat} participantsLabel={getLabel(chat)} onPress={() => router.push({ pathname: "/user/chat/[chatId]", params: { chatId: chat.id } })} />
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
