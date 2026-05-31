import { CustomButton } from "@/components/CustomButton";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useExitAppConfirmation } from "@/hooks/useExitAppConfirmation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function UserDashboard() {
  const { ready, user } = useProtectedRoute("user");
  const router = useRouter();

  useExitAppConfirmation(ready);

  if (!ready) {
    return null;
  }

  return (
    <ScreenWrapper>
      <Header title="Welcome" subtitle={`Hello, ${user?.name || "friend"}`} />
      <View style={styles.grid}>
        <CustomButton title="My Profile" onPress={() => router.push("/user/profile")} style={styles.actionButton} />
        <CustomButton title="Chats" onPress={() => router.push("/user/chat-list")} style={styles.actionButton} />
        <CustomButton title="Find Users" onPress={() => router.push("/user/users")} style={styles.actionButton} variant="secondary" />
        <CustomButton title="Edit Profile" onPress={() => router.push("/user/edit-profile")} variant="secondary" style={styles.actionButton} />
      </View>
      <Text style={styles.help}>Use the bottom actions to keep your profile and conversations up to date.</Text>
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
