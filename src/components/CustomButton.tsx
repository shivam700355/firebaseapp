import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import type { StyleProp } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  style?: StyleProp<ViewStyle>;
}

export function CustomButton({ title, onPress, loading = false, variant = "primary", style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "secondary" && styles.secondary, variant === "ghost" && styles.ghost, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? "#2563EB" : "#fff"} />
      ) : (
        <Text style={[styles.text, variant === "ghost" && styles.ghostText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: "#F3F4F6",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  ghostText: {
    color: "#2563EB",
  },
});
