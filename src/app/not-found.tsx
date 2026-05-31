import { CustomButton } from "@/components/CustomButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFound() {
  return (
    <ScreenWrapper centered>
      <View style={styles.root}>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>The route you are looking for does not exist.</Text>
        <Link href="/" style={styles.link}>
          <CustomButton title="Go Home" onPress={() => {}} />
        </Link>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  link: {
    width: "100%",
  },
});
