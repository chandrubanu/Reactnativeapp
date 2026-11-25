import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../features/auth/useAuth';
import { getDashboardCount, useExportAttendanceCsv } from '../../features/admin/useAdminDashboard';
import { isSuperAdmin } from '../../utils/roles';
import { AdminShell } from '../../components/admin/AdminShell';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AdminRecentActivities from '@/components/admin/AdminRecentActivities';
import { formatDate, getTodayDate } from '@/utils/dateformat';
import { AdminCards } from '@/components/admin/AdminCards';
import { toast } from '@/utils/toast';
import {
  MonthPicker,
  MonthOption,
  buildMonthOptions,
  formatMonthParam,
} from '@/components/admin/MonthPicker';


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
  const { employee } = useAuth();
  const dateLabel = formatDate(new Date());

  const MONTH_OPTIONS = useMemo(buildMonthOptions, []);
  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(MONTH_OPTIONS[0]);

  const triggerExport = (opt?: MonthOption) => {
    const officeId = employee?.office?.centerId;
    if (!officeId) {
      toast.error('No office assigned', 'Cannot export — please assign an office first.');
      return;
    }
    const target = opt ?? selectedMonth;
    // month param: "YYYY-MM" with zero-padded month e.g. "2026-05"
    exportCsv({
      officeId,
      date: todayDate,
      month: target.month,
      year: target.year,
    });
  };


  const handleMonthChange = (opt: MonthOption) => {
    setSelectedMonth(opt);
    triggerExport(opt);
  };

  return (
    <AdminShell activeItem="Dashboard" pageTitle="Dashboard">
      <View>
        <View className="my-3">
          <Text className="font-semibold color-textPrimary text-[30px]">Today's Overview</Text>
          <Text style={styles.desc}>
            Welcome Back {employee?.name}, Real - time attendance summary for {dateLabel}
          </Text>
        </View>
      </View>

      <AdminCards overview={overview} />

      {/* ── Recent Activity header + export controls ─────────────────── */}
      <View className="flex-row items-center justify-between flex-wrap" style={{ gap: 8 }}>
        <Text className="font-semibold color-textPrimary text-[20px]">Recent Activity</Text>

        <View style={styles.exportRow}>
          {/* Month dropdown */}
          <MonthPicker
            selected={selectedMonth}
            options={MONTH_OPTIONS}
            onChange={handleMonthChange}
          />

          {/* Export button */}
          <Pressable
            style={[styles.exportBtn, isExporting && styles.exportBtnDisabled]}
            onPress={() => triggerExport()}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={13} color="#fff" />
                <Text style={styles.exportText}>Export</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      <AdminRecentActivities />

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : null}
      {isError ? (
        <Text style={styles.message}>{ERROR_MESSAGES[AppErrorCode.SERVER_ERROR]}</Text>
      ) : null}
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  denied: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  deniedText: { ...typography.bodyBold, color: colors.danger },
  desc: {
    ...typography.body,
    textTransform: 'capitalize',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
  },
  exportBtnDisabled: { opacity: 0.6 },
  exportText: { fontSize: 12, color: '#fff' },
  message: { marginTop: spacing.sm, fontSize: 13 },
});
