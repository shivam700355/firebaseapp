
  import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

  import { Picker } from "@react-native-picker/picker";

  import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

  import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

  export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    const router = useRouter();
    const { setUser } = useAuth();

    const register = async () => {
      if (!name || !email || !password) {
        Alert.alert("Please fill all fields");
        return;
      }

      try {
        const profile = await registerUser(name, email, password, role);

        setUser(profile);

        Alert.alert("Success", "Registration Completed");

        if (profile.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      } catch (error: any) {
        Alert.alert("Registration failed", error.message || String(error));
      }
    };

    return (
      <View style={styles.container}>
        <CustomInput placeholder="Name" value={name} onChangeText={setName} />

        <CustomInput placeholder="Email" value={email} onChangeText={setEmail} />

        <CustomInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Picker selectedValue={role} onValueChange={setRole}>
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        <CustomButton title="Register" onPress={register} />
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