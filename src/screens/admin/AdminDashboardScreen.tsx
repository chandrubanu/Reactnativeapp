import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../features/auth/useAuth';
import { getDashboardCount, useExportAttendanceCsv } from '../../features/admin/useAdminDashboard';
import { isSuperAdmin } from '../../utils/roles';
import { AdminShell } from '../../components/admin/AdminShell';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { AdminDashboardCards } from '../../types/admin';
import { Octicons } from '@expo/vector-icons';
import AdminRecentActivities from '@/components/admin/AdminRecentActivities';
import { formatDate, getTodayDate } from '@/utils/dateformat';
import { AdminCards } from '@/components/admin/AdminCards';

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
  const todayDate = getTodayDate();
  const { data, isLoading, isError } = getDashboardCount(todayDate);
  const overview = data?.overview;
  const { todayMonth, todayYear } = useMemo(() => {
    const today = new Date();
    return {
      todayMonth: today.getMonth() + 1,
      todayYear: today.getFullYear(),
    };
  }, []);
  const { employee } = useAuth();
  const dateLabel = formatDate(new Date())

  const handlePunch = () => {
    const officeId = employee?.office?.centerId;
    if (!officeId) {
      alert('No office assigned. Cannot export.');
      return;
    }
    exportCsv({ officeId, date: todayDate, month: todayMonth, year: todayYear });
  };
  return (
    <AdminShell activeItem="Dashboard" pageTitle="Dashboard">
      <View  >
        <View className='my-3' >
          <Text className='font-semibold color-textPrimary text-[30px]' >Today's Overview</Text>
          <Text style={styles.desc}>
            Welcome Back  {employee?.name}, Real - time attendance summary for {dateLabel}
          </Text>
        </View>
      </View>
      <AdminCards overview={overview} />
      <View className="flex-row items-center justify-between"   >
        <Text className='font-semibold color-textPrimary text-[20px]'>Recent Activity</Text>
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
  desc: { ...typography.body, textTransform: 'capitalize', fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4, borderRadius: radii.sm, minWidth: 148, justifyContent: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#A9B6D6' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  message: { marginTop: spacing.sm, fontSize: 13 },

});
