import React, { createElement, useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { locationService } from '../../services/locationService';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';
import { DeviceLocationSample } from '../../types/location';
import { PrimaryButton } from '../common/PrimaryButton';
import { colors, radii, spacing, typography } from '../../constants/theme';

interface Props {
  visible: boolean;
  centerLabel: string;
  onCancel: () => void;
  onConfirm: (latitude: number, longitude: number) => void;
}

const LOW_ACCURACY_METERS = 50;

/**
 * Spec flow: read GPS -> show coordinates -> show on a map -> admin verifies
 * -> only then are the values applied. react-native-maps has no web support,
 * so on web we embed an OpenStreetMap iframe (no API key, no extra library).
 */
export function SetCurrentLocationModal({ visible, centerLabel, onCancel, onConfirm }: Props) {
  const [sample, setSample] = useState<DeviceLocationSample | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setSample(null);
    setError(null);
    setLoading(true);
    locationService
      .getCurrentSample()
      .then(setSample)
      .catch((err) => {
        const code = err instanceof AppError ? err.code : AppErrorCode.UNKNOWN;
        setError(ERROR_MESSAGES[code]);
      })
      .finally(() => setLoading(false));
  }, [visible]);

  const lat = sample?.coords.latitude;
  const lng = sample?.coords.longitude;
  const mapUrl =
    lat !== undefined && lng !== undefined
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003},${lat - 0.002},${lng + 0.003},${lat + 0.002}&layer=mapnik&marker=${lat},${lng}`
      : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Set current location</Text>
          <Text style={styles.sub}>{centerLabel}</Text>

          {loading ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {sample && mapUrl ? (
            <>
              <Text style={styles.coords}>
                {lat!.toFixed(6)}, {lng!.toFixed(6)}  (±{Math.round(sample.accuracyMeters)} m)
              </Text>
              {sample.accuracyMeters > LOW_ACCURACY_METERS ? (
                <Text style={styles.warn}>
                  Low accuracy. Desktop browsers estimate location from Wi-Fi/IP, so this can be far off.
                  Check the marker on the map, or type the coordinates manually instead.
                </Text>
              ) : null}
              {createElement('iframe', {
                src: mapUrl,
                title: 'Location preview',
                style: { width: '100%', height: 220, border: 0, borderRadius: 12 },
              })}
            </>
          ) : null}

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <PrimaryButton
              label="Use this location"
              disabled={!sample}
              onPress={() => sample && onConfirm(sample.coords.latitude, sample.coords.longitude)}
              style={styles.confirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,20,40,0.45)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  dialog: { width: '100%', maxWidth: 520, backgroundColor: '#fff', borderRadius: radii.md, padding: spacing.lg, gap: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  sub: { ...typography.body, color: colors.textSecondary },
  coords: { fontFamily: 'monospace', fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm },
  warn: { color: colors.warning, fontSize: 12 },
  error: { color: colors.danger, marginVertical: spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  cancel: { padding: spacing.sm },
  cancelText: { color: colors.textSecondary, fontWeight: '600' },
  confirm: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2 },
});
