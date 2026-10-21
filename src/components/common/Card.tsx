import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

interface CardProps {
  style?: ViewStyle;
}

/**
 * Reusable rounded-card container used everywhere on the dashboard.
 * Angular comparison: this is like a shared `<app-card>` component with
 * an <ng-content> slot — here `children` (React's built-in slot prop)
 * plays that role.
 */
export function Card({ children, style }: PropsWithChildren<CardProps>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    shadowColor: '#0B1A3B',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2, // Android shadow equivalent — iOS uses the shadow* props above
  },
});
