import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/useAuth';
import { useCenterSettings, useSaveCenterSettings } from '../../features/admin/useAdminSettings';
import {
  adminSettingsSchema,
  AdminSettingsFormValues,
  toCenterSettings,
  toFormValues,
} from '../../validation/adminSettingsSchema';
import { isSuperAdmin } from '../../utils/roles';
import { AdminShell } from '../../components/admin/AdminShell';
import { ShiftScheduleCard } from '../../components/admin/ShiftScheduleCard';
import { GeofenceRow } from '../../components/admin/GeofenceRow';
import { SetCurrentLocationModal } from '../../components/admin/SetCurrentLocationModal';
import { admin } from '../../components/admin/adminTheme';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

export default function AdminSettingsScreen() {
  const { employee } = useAuth();

  // Second line of defence — RootNavigator already only mounts this screen
  // for super admins, but a screen should never trust its caller.
  if (!isSuperAdmin(employee)) {
    return (
      <View style={styles.denied}>
        <Text style={styles.deniedText}>{ERROR_MESSAGES[AppErrorCode.FORBIDDEN]}</Text>
      </View>
    );
  }
  return <SettingsContent />;
}

function SettingsContent() {
  const query = useCenterSettings();
  const save = useSaveCenterSettings();
  const [pickIndex, setPickIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const { control, handleSubmit, getValues, reset, setValue, watch, trigger, formState: { errors, isDirty, dirtyFields } } =
    useForm<AdminSettingsFormValues>({
      resolver: zodResolver(adminSettingsSchema),
      defaultValues: { centers: [] },
    });
  const { fields } = useFieldArray({ control, name: 'centers' });

  // Load server data into the form (and re-sync after a successful save).
  useEffect(() => {
    if (query.data) reset(toFormValues(query.data));
  }, [query.data, reset]);

  // const onSave = async (values: AdminSettingsFormValues) => {
  //   setMessage(null);
  //   try {
  //     await save.mutateAsync(toCenterSettings(values));
  //     setMessage({ ok: true, text: 'Changes saved.' });
  //   } catch (err) {
  //     const code = err instanceof AppError ? err.code : AppErrorCode.UNKNOWN;
  //     setMessage({ ok: false, text: ERROR_MESSAGES[code] });
  //   }
  // };
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const onSaveRow = async (index: number) => {
    setMessage(null);
    setSavingIndex(index);
    try {
      const isValid = await trigger(`centers.${index}`);
      if (!isValid) {
        setMessage({
          ok: false,
          text: 'Please correct the validation errors.',
        });
        return;
      }
      // Get the latest values for this center
      const center = getValues(`centers.${index}`);

      // Convert latitude and longitude to numbers
      const payload = {
        ...center,
        latitude: Number(center.latitude),
        longitude: Number(center.longitude),
      };
      await save.mutateAsync([payload]);
      setMessage({
        ok: true,
        text: `${center.centerCode} settings saved.`,
      });
    } catch (err) {
      const code =
        err instanceof AppError ? err.code : AppErrorCode.UNKNOWN;

      setMessage({
        ok: false,
        text: ERROR_MESSAGES[code],
      });
    }
    finally {
      setSavingIndex(null);
    }
  };

  const applyLocation = (lat: number, lng: number) => {
    if (pickIndex === null) return;
    const opts = { shouldDirty: true, shouldValidate: true };
    setValue(`centers.${pickIndex}.latitude`, lat.toFixed(6), opts);
    setValue(`centers.${pickIndex}.longitude`, lng.toFixed(6), opts);
    setPickIndex(null);
  };
  const pickedLabel = pickIndex !== null ? watch(`centers.${pickIndex}.locationLabel`) : '';
  return (
    <AdminShell activeItem="Settings" pageTitle="Settings">
      {/* <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Global Governance</Text>
          <Text style={styles.desc}>
            Configure regional operational parameters including localized shift timings and geofencing
            coordinates for center-wide compliance.
          </Text>
        </View>
        <Pressable
          style={[styles.saveBtn, (!isDirty || save.isPending) && styles.saveBtnDisabled]}
          disabled={!isDirty || save.isPending}
          onPress={handleSubmit(onSave)}
        >
          {save.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={14} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </>
          )}
        </Pressable>
      </View>

      {message ? (
        <Text style={[styles.message, { color: message.ok ? colors.success : colors.danger }]}>{message.text}</Text>
      ) : null}

      {query.isLoading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} /> : null}
      {query.isError ? <Text style={styles.message}>{ERROR_MESSAGES[AppErrorCode.SERVER_ERROR]}</Text> : null} */}

      {fields.length > 0 ? (
        <>
          {/* <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={[styles.sectionIcon, { backgroundColor: '#DCE6FF' }]}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Regional Shift Schedules</Text>
                <Text style={styles.sectionDesc}>Define standard operating hours for each active fulfillment center.</Text>
              </View>
            </View>
            <View style={styles.cardsRow}>
              {fields.map((f, i) => (
                <ShiftScheduleCard
                  key={f.id}
                  index={i}
                  centerCode={f.centerCode}
                  isActive={f.isActive}
                  control={control}
                  errors={errors}
                />
              ))}
            </View>
          </View> */}

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={[styles.sectionIcon, { backgroundColor: admin.accentOrangeBg }]}>
                <Ionicons name="location-outline" size={20} color={admin.accentOrange} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Geofencing &amp; GPS Parameters</Text>
                <Text style={styles.sectionDesc}>Update precise geolocation anchors for mobile punch-in verification.</Text>
              </View>
            </View>
            <View style={{ gap: spacing.sm }}>
              {fields.map((f, i) => {
                const isRowDirty = !!dirtyFields.centers?.[i];
                return (<GeofenceRow
                  key={f.id}
                  index={i}
                  centerCode={f.centerCode}
                  locationLabel={f.locationLabel}
                  control={control}
                  errors={errors}
                  onSetCurrent={() => setPickIndex(i)}
                  onSaveRow={onSaveRow}
                  isSaving={savingIndex === i}
                  isDirty={isRowDirty}
                />)
              })}
            </View>

          </View>

        </>
      ) : null}

      <SetCurrentLocationModal
        visible={pickIndex !== null}
        centerLabel={pickedLabel}
        onCancel={() => setPickIndex(null)}
        onConfirm={applyLocation}
      />
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  denied: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  deniedText: { ...typography.bodyBold, color: colors.danger },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, marginTop: spacing.md },
  h1: { ...typography.bodyBold, color: colors.textPrimary },
  desc: { ...typography.body, fontSize: 13, color: colors.textSecondary, marginTop: 6, maxWidth: 480 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4, borderRadius: radii.sm, minWidth: 148, justifyContent: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#A9B6D6' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  message: { marginTop: spacing.sm, fontSize: 13 },
  section: { backgroundColor: admin.sectionBg, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.lg, gap: spacing.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sectionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { ...typography.bodyBold, color: colors.textPrimary },
  sectionDesc: { fontSize: 13, color: colors.textSecondary },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
