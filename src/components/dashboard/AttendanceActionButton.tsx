import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../common/PrimaryButton';

interface AttendanceActionButtonProps {
  label: string; // "Punch In" / "Punch Out" / "Punch In (End Break)" etc.
  enabled: boolean;
  loading: boolean;
  onPress: () => void;
  className?: string;
}

/** Maps each button label to a matching Ionicon */
function getIconForLabel(label: string): React.ComponentProps<typeof Ionicons>['name'] {
  const lower = label.toLowerCase();
  if (lower.includes('punch in') && lower.includes('break')) return 'cafe-outline';   // end break → back to work
  if (lower.includes('punch in')) return 'finger-print';                              // first punch in
  if (lower.includes('punch out')) return 'log-out-outline';                           // punch out
  if (lower.includes('break')) return 'cafe-outline';                              // break start
  return 'finger-print';                                                                // fallback
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
  className,
}: AttendanceActionButtonProps) {
  return (
    <PrimaryButton
      label={label}
      disabled={!enabled}
      loading={loading}
      onPress={onPress}
      icon={getIconForLabel(label)}
      className={className}
    />
  );
}
