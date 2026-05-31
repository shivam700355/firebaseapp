import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface Props {
  children: ReactNode;
  centered?: boolean;
}

export function ScreenWrapper({ children, centered = false }: Props) {
  return (
    <View style={[styles.root, centered && styles.centered]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centered: {
    justifyContent: "center",
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
});
