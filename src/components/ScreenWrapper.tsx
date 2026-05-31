import { COLORS, SIZES } from "@/theme";
import { ReactNode } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  children: ReactNode;
  centered?: boolean;
}

export function ScreenWrapper({ children, centered = false }: Props) {
  return (
    <SafeAreaView style={[styles.root as ViewStyle, centered && styles.centered]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: "center",
  },
  content: {
    paddingVertical: SIZES.spacing,
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: SIZES.spacing,
    width: '100%',
    alignSelf: 'center',
    maxWidth: SIZES.containerWidth,
  },
});
