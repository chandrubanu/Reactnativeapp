import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, RefreshControl } from 'react-native';
import { useAuth } from '../../features/auth/useAuth';
import { useDashboardSummary } from '../../features/dashboard/useDashboard';
import { useTodayAttendance, useSubmitPunch } from '../../features/attendance/useAttendance';
import { useLocationValidation } from '../../features/location/useLocationValidation';
import { getPrimaryActionForStatus } from '../../features/attendance/attendanceStateMachine';
import { authenticateWithBiometrics, isBiometricAvailable } from '../../services/biometricService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { CurrentShiftCard } from '../../components/dashboard/CurrentShiftCard';
import { LocationStatusCard } from '../../components/dashboard/LocationStatusCard';
import { AttendanceActionButton } from '../../components/dashboard/AttendanceActionButton';
import { PunctualityCard } from '../../components/dashboard/PunctualityCard';
import { WeeklyOverview } from '../../components/dashboard/WeeklyOverview';
import { PerformanceCard } from '../../components/dashboard/PerformanceCard';
import { colors, spacing } from '../../constants/theme';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';
import { Card } from '@/components/common/Card';

/**
 * DashboardScreen is intentionally "thin": it wires hooks together and
 * passes plain data/callbacks down to presentational components. All the
 * actual decisions (can we punch? what does the button say? is location
 * valid?) live in services/hooks/state-machine files, per your rule
 * "never put business logic directly inside large screen components".
 */
export default function DashboardScreen() {
  const { employee, logout } = useAuth();
  const employeeId = employee?.id;

  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } =
    useDashboardSummary(employeeId);
  const { data: attendance, refetch: refetchAttendance } = useTodayAttendance(employeeId);
  const { checkLocation, isChecking, result: locationResult, sample: locationSample, errorMessage: locationError } =
    useLocationValidation(employeeId ?? '');
  const submitPunch = useSubmitPunch();

  const [actionError, setActionError] = useState<string | null>(null);

  // Check location once when the screen mounts (and whenever the
  // employee changes). Angular comparison: similar to an `ngOnInit` call
  // that kicks off an async operation — here it's a plain useEffect.
  useEffect(() => {
    if (employeeId) checkLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);


  const currentStatus = attendance?.status;
  const primaryAction = currentStatus ? getPrimaryActionForStatus(currentStatus) : null;
  const dateLabel = useMemo(
    () =>
      new Date()
        .toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        .toUpperCase(),
    [],
  );

  const canPunch = Boolean(primaryAction) && Boolean(locationResult?.isInside) && !submitPunch.isPending;
  const handlePunch = async () => {
    setActionError(null);
    if (!employee || !primaryAction || !locationResult || !locationResult.isInside) return;

    try {
      // Step: validate biometric requirement if enabled for this employee,
      // per spec section 1 & 4. If unavailable, we surface the standard
      // BIOMETRIC_NOT_AVAILABLE message rather than silently skipping it.
      let biometricVerified = false;
      if (employee.biometricEnabled) {
        const available = await isBiometricAvailable();
        if (!available) {
          throw new AppError(AppErrorCode.BIOMETRIC_NOT_AVAILABLE);
        }
        biometricVerified = await authenticateWithBiometrics('Verify to record attendance');
      }

      await submitPunch.mutateAsync({
        employeeId: employee.id,
        punchType: primaryAction.punchType,
        timestampIso: new Date().toISOString(),
        coordinates: {
          latitude: locationSample?.coords.latitude ?? 0,
          longitude: locationSample?.coords.longitude ?? 0,
        },
        accuracyMeters: locationResult.accuracyMeters ?? 0,
        centerId: locationResult.centerId ?? '',
        distanceMeters: locationResult.distanceMeters ?? 0,
        isMockLocation: locationResult.isMockLocation ?? false,
        biometricVerified,
      });
    } catch (err) {
      const message =
        err instanceof AppError ? err.message : ERROR_MESSAGES[AppErrorCode.UNKNOWN];
      setActionError(message);
    }
  };

  const handleRefresh = () => {
    refetchSummary();
    refetchAttendance();
    checkLocation();
  };

  if (!employee || loadingSummary || !summary) {
    return (
      <View style={styles.centered}>
        <Text>Loading dashboard…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
    >
      <DashboardHeader employeeName={employee.name} dateLabel={dateLabel} />
      <Card style={styles.card} >
        <CurrentShiftCard
          shiftLabel={summary.currentShiftLabel}
          startTime={summary.shiftStart}
          endTime={summary.shiftEnd}
          isActive={currentStatus === 'PUNCHED_IN' || currentStatus === 'ON_BREAK'}
        />

        <LocationStatusCard isChecking={isChecking} result={locationResult} errorMessage={locationError} />

        {/* {actionError ? <Text style={styles.actionError}>{actionError}</Text> : null} */}

        {primaryAction ? (
          <AttendanceActionButton
            className={"mt-5"}
            label={primaryAction.label}
            enabled={canPunch}
            loading={submitPunch.isPending}
            onPress={handlePunch}
          />
        ) : (
          <Text style={styles.doneText}>No further action available today.</Text>
        )}
      </Card>
      <View style={styles.row}>
        {<PunctualityCard percentage={summary.punctuality.percentage} />}
        <View style={styles.weeklyWrap}>
          <WeeklyOverview days={summary.weeklyOverview} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Total Performance</Text>
      <PerformanceCard stats={summary.performance} />

      <Text onPress={logout} style={styles.logout}>
        Log out
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primaryLight },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: spacing.md },
  weeklyWrap: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm },
  actionError: { color: colors.danger, marginBottom: spacing.xs },
  doneText: { color: colors.textSecondary, textAlign: 'center', marginVertical: spacing.md },
  logout: { color: colors.danger, textAlign: 'center', marginTop: spacing.lg },
});
