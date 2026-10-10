import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

// Stub screen — wire up to features/leave (types/leave.ts already defines
// the Leave/LeaveType/LeaveStatus shapes) when this feature is built out.
export default function LeaveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Leave — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  text: { ...typography.body, color: colors.textSecondary },
});
