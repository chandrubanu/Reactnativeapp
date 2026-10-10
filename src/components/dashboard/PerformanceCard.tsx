import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors, spacing, typography } from '../../constants/theme';
import { PerformanceStats } from '../../types/dashboard';

interface PerformanceCardProps {
  stats: PerformanceStats;
}

export function PerformanceCard({ stats }: PerformanceCardProps) {
  return (
    <View style={styles.row}>
      <Card style={styles.cell}>
        <Text style={styles.label}>DAILY</Text>
        <Text style={styles.value}>{stats.daily.value}</Text>
        {stats.daily.deltaLabel ? (
          <Text style={styles.sub}>{stats.daily.deltaLabel}</Text>
        ) : null}
      </Card>
      <Card style={styles.cell}>
        <Text style={styles.label}>WEEKLY</Text>
        <Text style={styles.value}>{stats.weekly.value}</Text>
        {stats.weekly.targetLabel ? (
          <Text style={styles.sub}>{stats.weekly.targetLabel}</Text>
        ) : null}
      </Card>
      <Card style={styles.cell}>
        <Text style={styles.label}>MONTHLY</Text>
        <Text style={styles.value}>{stats.monthly.value}</Text>
        {stats.monthly.rankLabel ? (
          <Text style={styles.sub}>{stats.monthly.rankLabel}</Text>
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  cell: { flex: 1, alignItems: 'center' },
  label: { ...typography.caption, color: colors.textSecondary },
  value: { ...typography.h1, color: colors.primary, marginTop: spacing.xs },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
