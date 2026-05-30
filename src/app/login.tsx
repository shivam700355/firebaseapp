import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const { setUser } = useAuth();

    const login = async () => {
        try {
            const user = await loginUser(email, password);

            setUser(user);

            if (user.role === "admin") {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/user/dashboard");
            }
        } catch (error: any) {
            Alert.alert("Login failed", error.message || String(error));
        }
    };

    return (
        <View style={styles.container}>
            <CustomInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <CustomInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <CustomButton title="Login" onPress={login} />
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