import { StyleSheet, Text, View } from "react-native";

interface Props {
  status: string;
}

export function StatusPill({ status }: Props) {
  const isOnline = status === "online";
  return (
    <View style={[styles.badge, isOnline ? styles.online : styles.offline]}>
      <Text style={[styles.label, isOnline ? styles.onlineText : styles.offlineText]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  online: {
    backgroundColor: "#DCFCE7",
  },
  offline: {
    backgroundColor: "#FEE2E2",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  onlineText: {
    color: "#16A34A",
  },
  offlineText: {
    color: "#B91C1C",
  },
});
