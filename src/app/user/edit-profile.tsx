import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { Header } from "@/components/Header";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { updateProfile } from "@/services/userService";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

export default function EditProfile() {
  const { ready, user } = useProtectedRoute("user");
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  if (!ready) {
    return null;
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      if (!user) return;
      await updateProfile(user.uid, { name: name.trim(), avatarUrl: avatarUrl.trim() });
      setUser({ ...user, name: name.trim(), avatarUrl: avatarUrl.trim() });
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (error: any) {
      Alert.alert("Update failed", error.message || "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Edit Profile" subtitle="Update your display name and avatar." />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.form}>
        <CustomInput label="Name" value={name} onChangeText={setName} />
        <CustomInput label="Avatar URL" placeholder="https://..." value={avatarUrl} onChangeText={setAvatarUrl} />
        <CustomButton title="Save Changes" onPress={handleSave} loading={loading} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 420,
    alignItems: "stretch",
    paddingHorizontal: 0,
  },
});
