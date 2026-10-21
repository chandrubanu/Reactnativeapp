import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { WeeklyOverviewDay } from '../../types/dashboard';

interface WeeklyOverviewProps {
  days: WeeklyOverviewDay[];
}

const MAX_BAR_HEIGHT = 64;
const MAX_HOURS_SCALE = 10; // bars scale relative to a 10-hour day

export function WeeklyOverview({ days }: WeeklyOverviewProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>WEEKLY OVERVIEW</Text>
      <View style={styles.barsRow}>
        {days.map((day, index) => {
          const heightRatio = Math.min(1, day.workedHours / MAX_HOURS_SCALE);
          const barHeight = Math.max(6, heightRatio * MAX_BAR_HEIGHT);
          return (
            <View key={`${day.dayLabel}-${index}`} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: barHeight },
                    day.isToday ? styles.barToday : null,
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{day.dayLabel.slice(-2)}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  title: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  barColumn: { alignItems: 'center', gap: spacing.xs },
  barTrack: { height: MAX_BAR_HEIGHT, justifyContent: 'flex-end' },
  bar: {
    width: 18,
    borderRadius: radii.sm,
    backgroundColor: colors.chartTrackLight,
  },
  barToday: { backgroundColor: colors.primary },
  dayLabel: { ...typography.caption, color: colors.textSecondary },
});
