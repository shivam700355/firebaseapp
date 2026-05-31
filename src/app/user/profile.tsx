import { CustomButton } from "@/components/CustomButton";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { logoutUser } from "@/services/authService";
import { DEFAULT_AVATAR } from "@/utils/constants";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function UserProfilePage() {
  const { ready, user } = useProtectedRoute("user");
  const router = useRouter();

  if (!ready) {
    return null;
  }

  return (
    <ScreenWrapper>
      <Header title="My Profile" subtitle="Review and update your account details." />
      <View style={styles.card}>
        <Image source={{ uri: user?.avatarUrl || DEFAULT_AVATAR }} style={styles.avatar} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <CustomButton title="Edit Profile" onPress={() => router.push("/user/edit-profile")} />
      <CustomButton title="My Chats" onPress={() => router.push("/user/chat-list")} variant="secondary" style={styles.secondaryButton} />
      <CustomButton title="Logout" onPress={async () => { await logoutUser(); router.replace("/login"); }} variant="ghost" style={styles.logoutButton} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 22,
    backgroundColor: "#fff",
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  role: {
    color: "#2563EB",
    fontWeight: "700",
    marginBottom: 8,
  },
  email: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  secondaryButton: {
    marginTop: 16,
  },
  logoutButton: {
    marginTop: 12,
  },
});
