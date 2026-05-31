import { AuthProvider } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootLayout() {
  usePushNotifications();

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}