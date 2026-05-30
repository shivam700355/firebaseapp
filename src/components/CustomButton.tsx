import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  loading,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.text}>
        {loading ? "Please Wait..." : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});