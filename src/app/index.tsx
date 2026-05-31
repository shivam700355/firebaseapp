import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [loading, router, user]);

  return (
    <ScreenWrapper centered>
      <ActivityIndicator size="large" color="#2563EB" />
    </ScreenWrapper>
  );
}