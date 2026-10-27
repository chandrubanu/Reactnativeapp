import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../features/auth/useAuth';
import { useCenterSettings, getDashboardCount, useSaveCenterSettings, useExportAttendanceCsv } from '../../features/admin/useAdminDashboard';
import { isSuperAdmin } from '../../utils/roles';
import { AdminShell } from '../../components/admin/AdminShell';
import { admin } from '../../components/admin/adminTheme';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { AdminDashboardCards } from '../../types/admin';
import { Octicons } from '@expo/vector-icons';
import AdminRecentActivities from '@/components/admin/AdminRecentActivities';

export default function AdminDashboardScreen() {
  const { employee } = useAuth();


  if (!isSuperAdmin(employee)) {
    return (
      <View style={styles.denied}>
        <Text style={styles.deniedText}>{ERROR_MESSAGES[AppErrorCode.FORBIDDEN]}</Text>
      </View>
    );
  }
  return <DashboardContent />;
}

function DashboardContent() {
  const { mutate: exportCsv, isPending: isExporting } = useExportAttendanceCsv();
  const todayDate = useMemo(
    () => new Date().toISOString().split('T')[0],
    [],
  );
  const { data: query, isLoading, isError } = getDashboardCount(todayDate);
  const overview = query?.overview;
  const { employee } = useAuth();
  const dateLabel = useMemo(
    () =>
      new Date()
        .toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    [],
  );

  const handlePunch = () => {
    const officeId = employee?.office?.centerId;
    if (!officeId) {
      alert('No office assigned. Cannot export.');
      return;
    }
    exportCsv({ officeId, date: todayDate });
  };

  const carddetails: AdminDashboardCards[] = [
    {
      title: 'Punched In',
      count: overview?.punchedIn ?? 0,
      icon: 'check-circle',
      percentage: String(overview?.punchedInChangePercent ?? 0),
      color: 'success',
    },
    {
      title: 'Late Punches',
      count: overview?.latePunches ?? 0,
      icon: 'clock',
      percentage: String(overview?.latePunchesChangePercent ?? 0),
      color: 'textBrown',
    },
    {
      title: 'Absentees',
      count: overview?.absences ?? 0,
      icon: 'circle-slash',
      percentage: '—',
      color: 'danger',
    },
    {
      title: 'With Permission',
      count: overview?.withPermission ?? 0,
      icon: 'shield-check',
      percentage: '—',
      color: 'primary',
    },
  ];

  return (
    <AdminShell activeItem="Dashboard" pageTitle="Dashboard">
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Today's Overview</Text>
          <Text style={styles.desc}>
            Welcome Back  {employee?.name}, Real - time attendance summary for {dateLabel}
          </Text>
        </View>
      </View>
      <View style={styles.headerRow}>
        {carddetails.map((card) => (
          <View key={`${card.title}-${card.count}`} style={styles.card}>
            <View style={styles.cardHeader}>

              <View style={[styles.iconBox, { backgroundColor: `${colors[card.color]}12` }]}>
                <Octicons style={styles.icon} name={card.icon} size={20} color={colors[card.color]} />
              </View>

              <View style={[styles.badge, { backgroundColor: `${colors[card.color]}12` }]}>
                <Text style={[styles.badgeText, { color: colors[card.color] }]} >{card.percentage}</Text>
              </View>
            </View>

            <Text style={styles.count}>{card.count}</Text>
            <Text style={styles.label}>{card.title}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row items-center justify-between"   >
        <Text style={styles.h1}>Recent Activity</Text>
        <Pressable
          className="w-[100px] text-[10px] py-1 rounded-[7px] bg-primary items-center"
          onPress={handlePunch}
          disabled={isExporting}
          style={{ opacity: isExporting ? 0.6 : 1 }}
        >
          <Text className=" text-white">{isExporting ? 'Exporting…' : 'Export CSV'}</Text>
        </Pressable>
      </View>
      <AdminRecentActivities />
      {isLoading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} /> : null}
      {isError ? <Text style={styles.message}>{ERROR_MESSAGES[AppErrorCode.SERVER_ERROR]}</Text> : null}

    </AdminShell>
  );
}

const styles = StyleSheet.create({
  denied: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  deniedText: { ...typography.bodyBold, color: colors.danger },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, marginBottom: spacing.md, marginTop: spacing.md, width: '100%', },
  h1: { ...typography.bodyBold, color: colors.textPrimary },
  desc: { ...typography.body, textTransform: 'capitalize', fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4, borderRadius: radii.sm, minWidth: 148, justifyContent: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#A9B6D6' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  message: { marginTop: spacing.sm, fontSize: 13 },
  section: { backgroundColor: admin.sectionBg, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.lg, gap: spacing.md, flex: 1 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sectionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { ...typography.bodyBold, color: colors.textPrimary },
  sectionDesc: { fontSize: 13, color: colors.textSecondary },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    flex: 1,
    minHeight: 174,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EEF0F5',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  iconBox: {
    width: 41,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#E8EFF7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 23,
  },

  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  count: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 42,
  },

  label: {
    fontSize: 13,
    color: '#172554',
    marginTop: 2,
  },

});
