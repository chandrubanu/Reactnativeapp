import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { AdminSettingsFormValues } from '../../validation/adminSettingsSchema';
import { Card } from '../common/Card';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { admin } from './adminTheme';

interface Props {
  index: number;
  centerCode: string;
  isActive: boolean;
  control: Control<AdminSettingsFormValues>;
  errors: FieldErrors<AdminSettingsFormValues>;
}

export function ShiftScheduleCard({ index, centerCode, isActive, control, errors }: Props) {
  const e = errors.centers?.[index];
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.code}>{centerCode}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
        </View>
      </View>

      {(['shiftStart', 'shiftEnd'] as const).map((field) => (
        <View key={field} style={{ marginTop: spacing.sm }}>
          <Text style={styles.label}>{field === 'shiftStart' ? 'SHIFT START' : 'SHIFT END'}</Text>
          <Controller
            control={control}
            name={`centers.${index}.${field}`}
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="HH:mm"
                  maxLength={5}
                />
                <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
              </View>
            )}
          />
          {e?.[field] ? <Text style={styles.error}>{e[field]?.message}</Text> : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 220 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { ...typography.bodyBold, color: colors.textPrimary },
  badge: { backgroundColor: admin.sectionBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.pill },
  badgeText: { fontSize: 9, fontWeight: '700', color: colors.primary },
  label: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: admin.inputBg,
    borderRadius: 6, paddingHorizontal: spacing.sm + 2,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
  error: { color: colors.danger, fontSize: 11, marginTop: 2 },
});
