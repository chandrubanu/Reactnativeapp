import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { AdminSettingsFormValues } from '../../validation/adminSettingsSchema';
import { colors, radii, spacing } from '../../constants/theme';

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
  /** True when this row was appended as a blank new entry */
  isNew?: boolean;
  /** Shown only on the last row — opens a new blank row below */
  onAddNew?: () => void;
}

export function GeofenceRow({
  index, centerCode, locationLabel, control, errors,
  onSetCurrent, onSaveRow, isSaving, isDirty, isNew = false, onAddNew,
}: Props) {
  const e = errors.centers?.[index];

  return (
    <View>
      <View style={[styles.row, isNew && styles.rowNew]}>
        {/* ── Identity column ─────────────────────────────────────── */}
        <View style={styles.identity}>
          {isNew ? (
            <>
              {/* Editable Center Code */}
              {/* <Text style={styles.coordLabel}>CENTER CODE</Text>
              <Controller
                control={control}
                name={`centers.${index}.centerCode`}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. BLR"
                    placeholderTextColor={colors.textSecondary}
                  />
                )}
              />
              {e?.centerCode ? (
                <Text style={styles.error}>{e.centerCode?.message}</Text>
              ) : null} */}
              {/* Editable Location Label */}
              <Text style={[styles.coordLabel, { marginTop: 6 }]}>LOCATION LABEL</Text>
              <Controller
                control={control}
                name={`centers.${index}.locationLabel`}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. Chennai Hub"
                    placeholderTextColor={colors.textSecondary}
                  />
                )}
              />
              {e?.locationLabel ? (
                <Text style={styles.error}>{e.locationLabel?.message}</Text>
              ) : null}
            </>
          ) : (
            <Text style={styles.code}>{centerCode}</Text>
          )}
        </View>

        {/* ── Coordinate fields ────────────────────────────────────── */}
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
            {e?.[field] ? (
              <Text style={styles.error}>{e[field]?.message}</Text>
            ) : null}
          </View>
        ))}

        {/* ── Save button (shown when row has unsaved changes) ─────── */}
        {(isDirty || isNew) && (
          <Pressable
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            disabled={isSaving}
            onPress={() => onSaveRow(index)}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={14} color="#fff" />
                <Text style={styles.saveText}>{isNew ? 'Submit' : 'Save'}</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* ── Add New button (rendered below the last existing row) ── */}
      {onAddNew && (
        <Pressable style={styles.addNewBtn} onPress={onAddNew}>
          <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.addNewText}>Add New</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: '#fff',
    borderRadius: 8, borderLeftWidth: 3, borderLeftColor: colors.primary, padding: spacing.sm + 4, flexWrap: 'wrap',
  },
  rowNew: {
    borderLeftColor: colors.accentOrange ?? '#F59E0B',
    backgroundColor: '#FFFBF0',
  },
  identity: { width: 190 },
  code: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  codeInput: { fontSize: 13, fontWeight: '700' },
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
  addNewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    marginTop: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radii.sm, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed',
  },
  addNewText: { fontSize: 12, fontWeight: '600', color: colors.primary },
});
