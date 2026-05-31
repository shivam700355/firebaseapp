import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { UserCard } from "@/components/UserCard";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { createOrGetChat } from "@/services/chatService";
import { fetchUsers } from "@/services/userService";
import type { UserProfile } from "@/utils/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function AdminUsers() {
  const { ready, user } = useProtectedRoute("admin");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search, 500);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const results = await fetchUsers(debouncedSearch.trim());
      setUsers(results.filter((profile) => profile.uid !== user?.uid));
      setLoading(false);
    };

    if (ready) {
      load();
    }
  }, [debouncedSearch, ready, user]);

  const openChat = async (member: UserProfile) => {
    if (!user) return;
    const chat = await createOrGetChat([user.uid, member.uid]);
    router.push({ pathname: "/admin/chat/[chatId]", params: { chatId: chat.id } });
  };

  if (!ready) {
    return null;
  }

  return (
    <ScreenWrapper>
      <Header title="Users" subtitle="Search users and start a private conversation." />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <EmptyState title="Loading users" description="Fetching users from Firestore." />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try searching with a different name." />
      ) : (
        users.map((profile) => (
          <UserCard key={profile.uid} user={profile} onPress={() => openChat(profile)} />
        ))
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#111827",
  },
});
