import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { LocationValidationResult } from '../../types/location';

interface LocationStatusCardProps {
  isChecking: boolean;
  result: LocationValidationResult | null;
  errorMessage: string | null;
}

/**
 * Shows the exact copy required by the spec:
 * inside -> "You are within the office location. You can punch in."
 * outside -> "You are outside office radius."
 * plus the resolved center name + distance, per requirement #4/#6.
 */
export function LocationStatusCard({ isChecking, result, errorMessage }: LocationStatusCardProps) {
  if (isChecking) {
    return (
      <View style={styles.container}>
        <Text style={styles.checking}>Checking your location…</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[styles.container, styles.warn]}>
        <Text style={styles.warnText}>{errorMessage}</Text>
      </View>
    );
  }

  if (!result) return null;

  if (result.isMockLocation) {
    return (
      <View style={[styles.container, styles.warn]}>
        <Text style={styles.warnText}>⚠️ Fake location detected.</Text>
        <Text style={styles.meta}>
          Location spoofing apps are not allowed. Disable the fake GPS app and try again.
        </Text>
      </View>
    );
  }

  if (result.centerId && result.isAccuracyAcceptable === false) {
    return (
      <View style={[styles.container, styles.warn]}>
        <Text style={styles.warnText}>GPS accuracy is too low to confirm your location.</Text>
        <Text style={styles.meta}>
          {result.centerName} · {formatDistance(result.distanceMeters)}m away · GPS accuracy{' '}
          {formatDistance(result.accuracyMeters)}m (maximum {result.accuracyThresholdMeters}m).
          Move to an open area and check again.
        </Text>
      </View>
    );
  }

  if (result.isInside) {
    return (
      <View style={[styles.container, styles.ok]}>
        <Text style={styles.okText}>You are within the office location.</Text>
        <Text style={styles.meta}>
          {result.centerName} · {formatDistance(result.distanceMeters)}m away
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.warn]}>
      <Text style={styles.warnText}>You are outside office radius.</Text>
      {result.centerName ? (
        <Text style={styles.meta}>
          Nearest: {result.centerName} · {formatDistance(result.distanceMeters)}m away (limit{' '}
          {result.allowedRadiusMeters}m)
        </Text>
      ) : null}
    </View>
  );
}

function formatDistance(distanceMeters: number | null): string {
  if (distanceMeters === null) return 'unknown';
  if (distanceMeters < 1) return '<1';
  return String(Math.round(distanceMeters));
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.xs, textTransform: 'capitalize' },
  checking: { ...typography.body, color: colors.textSecondary },
  ok: {},
  okText: { ...typography.bodyBold, color: colors.success },
  warn: {},
  warnText: { ...typography.bodyBold, color: colors.danger },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
