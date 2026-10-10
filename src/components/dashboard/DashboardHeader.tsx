import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface DashboardHeaderProps {
  employeeName: string;
  dateLabel: string; // pre-formatted, e.g. "MONDAY, NOV 10, 2025"
  avatarUrl?: string;
}

export function DashboardHeader({ employeeName, dateLabel, avatarUrl }: DashboardHeaderProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.brand}>FootPro</Text>
        </View>
      </View>
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.greeting}>Good Morning, {employeeName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  brand: { ...typography.h2, color: colors.primary },
  dateLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
  greeting: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.xs },
});
