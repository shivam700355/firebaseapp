import { StatusPill } from "@/components/StatusPill";
import type { UserProfile } from "@/utils/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  user: UserProfile;
  onPress: () => void;
}

export function UserCard({ user, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <StatusPill status={user.status || "offline"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  email: {
    color: "#6B7280",
    marginTop: 4,
  },
});
