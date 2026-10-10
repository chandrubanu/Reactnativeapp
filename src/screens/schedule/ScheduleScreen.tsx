import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

// Stub screen — shift calendar / roster view is a natural next feature
// to build on top of features/shifts/shiftRepository.ts.
export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  text: { ...typography.body, color: colors.textSecondary },
});
