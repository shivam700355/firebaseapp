import { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";

export function useExitAppConfirmation(enabled = true) {
  useEffect(() => {
    if (Platform.OS !== "android" || !enabled) {
      return;
    }

    const onBackPress = () => {
      Alert.alert(
        "Exit app",
        "Do you want to exit the app?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, [enabled]);
}
