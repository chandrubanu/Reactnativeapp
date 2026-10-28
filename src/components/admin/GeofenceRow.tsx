import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { AdminSettingsFormValues, toCenterSettings } from '../../validation/adminSettingsSchema';
import { colors, radii, spacing } from '../../constants/theme';
import { useSaveCenterSettings } from '@/features/admin/useAdminDashboard';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '@/constants/errors';

interface Props {
  index: number;
  centerCode: string;
  locationLabel: string;
  control: Control<AdminSettingsFormValues>;
  errors: FieldErrors<AdminSettingsFormValues>;
  onSetCurrent: () => void;
  onSaveRow: (index: number) => void;
  isSaving: boolean;
  isDirty: boolean;
}


export function GeofenceRow({ index, centerCode, locationLabel, control, errors, onSetCurrent, onSaveRow,
  isSaving, isDirty }: Props) {
  const e = errors.centers?.[index];

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        <Text style={styles.code}>{centerCode}</Text>
        {/* <Text style={styles.label}>{locationLabel}</Text> */}
      </View>

      {(['latitude', 'longitude'] as const).map((field) => (
        <View key={field} style={styles.coordBox}>
          <Text style={styles.coordLabel}>{field.toUpperCase()}</Text>
          <Controller
            control={control}
            name={`centers.${index}.${field}`}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numbers-and-punctuation"
              />
            )}
          />
          {e?.[field] ? <Text style={styles.error}>{e[field]?.message}</Text> : null}
        </View>
      ))}

      {/* <Pressable style={styles.setBtn} onPress={onSetCurrent}>
        <Ionicons name="locate-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.setBtnText}>Set Current</Text>
      </Pressable> */}
      {isDirty && <Pressable
        style={[styles.saveBtn, (!isDirty || isSaving) && styles.saveBtnDisabled]}
        disabled={!isDirty || isSaving}
        onPress={() => onSaveRow(index)}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="save-outline" size={14} color="#fff" />
            <Text style={styles.saveText}>Save</Text>
          </>
        )}
      </Pressable>}

    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: '#fff',
    borderRadius: 8, borderLeftWidth: 3, borderLeftColor: colors.primary, padding: spacing.sm + 4, flexWrap: 'wrap',
  },
  identity: { width: 190 },
  code: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  label: { fontSize: 9, color: colors.primary, marginTop: 2 },
  coordBox: { flex: 1, minWidth: 140 },
  coordLabel: { fontSize: 9, fontWeight: '700', color: colors.textSecondary, marginBottom: 3 },
  input: {
    backgroundColor: colors.inputBg, borderRadius: 4, paddingHorizontal: spacing.sm + 2, paddingVertical: 8,
    fontSize: 12, fontFamily: 'monospace', color: colors.textPrimary,
  },
  error: { color: colors.danger, fontSize: 10, marginTop: 2 },
  setBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: 6,
  },
  setBtnText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4, borderRadius: radii.sm, justifyContent: 'center',
  },
  saveBtnDisabled: { backgroundColor: colors.textSecondary },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
