import { COLORS, SIZES } from '@/theme';
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function CustomInput({ label, style, containerStyle, ...props }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput {...props} style={[styles.input, style]} placeholderTextColor={COLORS.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing,
  },
  label: {
    marginBottom: 8,
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
});
