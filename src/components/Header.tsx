import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  profileLink?: string;
}

export function Header({ title, subtitle, leftAction, rightAction, profileLink }: Props) {
  const router = useRouter();
  const canGoBack = router.canGoBack?.();

  return (
    <View style={styles.root}>
      <View style={styles.left}>
        {leftAction ? (
          leftAction
        ) : canGoBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
        {profileLink ? (
          <TouchableOpacity onPress={() => router.push(profileLink as any)} style={styles.meButton}>
            <Text style={styles.meText}>Me</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 14,
  },
  right: {
    marginLeft: 16,
  },
  left: {
    marginRight: 12,
  },
  center: {
    flex: 1,
  },
  action: {
    marginBottom: 4,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  backText: {
    color: '#111827',
    fontWeight: '700',
  },
  meButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  meText: {
    color: '#111827',
    fontWeight: '700',
  },
});
