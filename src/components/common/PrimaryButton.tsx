import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

/**
 * `Pressable` is RN's modern touch-handling primitive (successor to
 * `TouchableOpacity`). Angular comparison: like a `<button>` but you
 * control the pressed/disabled visual states yourself via style functions
 * — there's no browser default button styling to override.
 */
export function PrimaryButton({ label, onPress, disabled, loading, style }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    backgroundColor: '#A9B6D6',
  },
  label: {
    color: colors.surface,
    ...typography.bodyBold,
    fontSize: 17,
  },
});
