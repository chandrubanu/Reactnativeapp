import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card } from '../common/Card';
import { colors, spacing, typography } from '../../constants/theme';

interface PunctualityCardProps {
  percentage: number; // authoritative value from backend
}

const SIZE = 96;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A simple ring chart built with react-native-svg (already a transitive
 * dependency of react-native-maps, and the standard way to draw custom
 * vector shapes in RN — there's no native <canvas>/CSS conic-gradient).
 */
export function PunctualityCard({ percentage }: PunctualityCardProps) {
  const progress = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <Card style={styles.card}>
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.chartTrackLight}
            strokeWidth={STROKE}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.primary}
            strokeWidth={STROKE}
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <Text style={styles.percentText}>{progress}%</Text>
      </View>
      <Text style={styles.label}>PUNCTUALITY</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  percentText: {
    position: 'absolute',
    ...typography.h2,
    color: colors.textPrimary,
  },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
});
