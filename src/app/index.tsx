import {
  StyleSheet,
  View,
} from "react-native";

import { router } from "expo-router";

import CustomButton from "../components/CustomButton";

export default function Home() {
  return (
    <View style={styles.container}>
      <CustomButton
        title="Login"
        onPress={() =>
          router.push("/login")
        }
      />

      <View style={{ height: 15 }} />

      <CustomButton
        title="Register"
        onPress={() =>
          router.push("/register")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});