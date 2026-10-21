import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

interface CurrentShiftCardProps {
  shiftLabel: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export function CurrentShiftCard({ shiftLabel, startTime, endTime, isActive }: CurrentShiftCardProps) {
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{shiftLabel}</Text>
        <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
          <Text style={styles.badgeText}>{isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
        </View>
      </View>
      <Text style={styles.timeRange}>
        {startTime} - {endTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.body, color: colors.textSecondary },
  timeRange: { ...typography.h1, color: colors.primaryDark, marginTop: spacing.xs },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.pill },
  badgeActive: { backgroundColor: colors.surface },
  badgeInactive: { backgroundColor: colors.border },
  badgeText: { ...typography.caption, color: colors.primary },
});
