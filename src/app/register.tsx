import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/services/authService";
import { ROLE_ADMIN, ROLE_USER } from "@/utils/constants";
import { validateEmail } from "@/utils/validation";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE_USER);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, setUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(user.role === ROLE_ADMIN ? "/admin/dashboard" : "/user/dashboard");
    }
  }, [authLoading, router, user]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation", "Name, email, and password are all required.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Validation", "Please use a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const profile = await registerUser(name.trim(), email.trim(), password, role);
      setUser(profile);
      router.replace(profile.role === ROLE_ADMIN ? "/admin/dashboard" : "/user/dashboard");
    } catch (error: any) {
      Alert.alert("Registration failed", error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register with your details and choose a role.</Text>

        <CustomInput label="Name" placeholder="Full name" value={name} onChangeText={setName} />
        <CustomInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <CustomInput label="Password" placeholder="Create password" value={password} secureTextEntry onChangeText={setPassword} />

        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Role</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={role} onValueChange={setRole} style={styles.pickerInner}>
              <Picker.Item label="User" value={ROLE_USER} />
              <Picker.Item label="Admin" value={ROLE_ADMIN} />
            </Picker>
          </View>
        </View>

        <CustomButton title="Register" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/login" style={styles.link}>Sign in</Link>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  form: { width: "100%", maxWidth: 420, alignItems: "stretch", paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8, color: "#111827" },
  subtitle: { fontSize: 15, color: "#6B7280", marginBottom: 24 },
  pickerWrapper: { marginBottom: 20 },
  pickerLabel: { marginBottom: 8, color: "#4B5563", fontWeight: "600" },
  pickerBox: { borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", overflow: "hidden", backgroundColor: "#FFFFFF" },
  pickerInner: { width: "100%" },
  footer: { marginTop: 18, flexDirection: "row", justifyContent: "center" },
  footerText: { color: "#6B7280" },
  link: { color: "#2563EB", fontWeight: "600" },
});