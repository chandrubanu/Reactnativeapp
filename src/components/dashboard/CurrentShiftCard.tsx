import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors, radii, spacing, typography } from '../../constants/theme';

interface CurrentShiftCardProps {
  shiftLabel: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export function CurrentShiftCard({ startTime, endTime, isActive }: CurrentShiftCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Current Shift</Text>
        <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
          <Text style={styles.badgeText}>{isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
        </View>
      </View>
      <Text style={styles.timeRange}>
        {startTime} - {endTime}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primaryLight },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.body, color: colors.textSecondary },
  timeRange: { ...typography.h1, color: colors.primaryDark, marginTop: spacing.xs },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.pill },
  badgeActive: { backgroundColor: colors.surface },
  badgeInactive: { backgroundColor: colors.border },
  badgeText: { ...typography.caption, color: colors.primary },
});
