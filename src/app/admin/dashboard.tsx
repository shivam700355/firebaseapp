import { CustomButton } from "@/components/CustomButton";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function AdminDashboard() {
  const { ready, user } = useProtectedRoute("admin");
  const router = useRouter();

  if (!ready) {
    return null;
  }

  return (
    <ScreenWrapper>
      <Header title="Admin Dashboard" subtitle={`Welcome back, ${user?.name || "admin"}`} />
      <View style={styles.grid}>
        <CustomButton title="Manage Users" onPress={() => router.push("/admin/users")} style={styles.actionButton} />
        <CustomButton title="Chat Inbox" onPress={() => router.push("/admin/chat-list")} style={styles.actionButton} />
        <CustomButton title="My Profile" onPress={() => router.push("/admin/profile")} variant="secondary" style={styles.actionButton} />
      </View>
      <Text style={styles.help}>Use the admin panel to search users and manage conversations.</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
  },
  actionButton: {
    marginBottom: 16,
  },
  help: {
    marginTop: 24,
    color: "#6B7280",
    fontSize: 14,
  },
});
