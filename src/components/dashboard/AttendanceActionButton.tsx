import React from 'react';
import { PrimaryButton } from '../common/PrimaryButton';

interface AttendanceActionButtonProps {
  label: string; // "Punch In" / "Punch Out" / "Punch In (End Break)" etc.
  enabled: boolean;
  loading: boolean;
  onPress: () => void;
}

/**
 * Presentational only — it does NOT decide what the label should say or
 * whether it should be enabled. That decision lives in
 * attendanceStateMachine.ts + the geofence result, and is passed in as
 * props from DashboardScreen. This is the "don't put business logic in
 * screen components" rule applied one level deeper: it's not even in the
 * screen, it's in a pure function the screen calls.
 */
export function AttendanceActionButton({
  label,
  enabled,
  loading,
  onPress,
}: AttendanceActionButtonProps) {
  return <PrimaryButton label={label} disabled={!enabled} loading={loading} onPress={onPress} />;
}
