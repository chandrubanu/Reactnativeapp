import { AttendanceStatus } from './attendance';

export interface Punctuality {
  percentage: number; // authoritative value FROM BACKEND, UI only displays it
  onTimeDays: number;
  lateDays: number;
  periodLabel: string; // e.g. "This Month"
}

export interface WeeklyOverviewDay {
  dayLabel: string; // "M", "T", "W"...
  workedHours: number;
  isToday: boolean;
}

export interface PerformanceStats {
  daily: { value: number; deltaLabel?: string };
  weekly: { value: number; targetLabel?: string };
  monthly: { value: number; rankLabel?: string };
}

export interface DashboardSummary {
  employeeName: string;
  dateIso: string;
  currentShiftLabel: string;
  shiftStart: string;
  shiftEnd: string;
  attendanceStatus: AttendanceStatus;
  punctuality: Punctuality;
  weeklyOverview: WeeklyOverviewDay[];
  performance: PerformanceStats;
}
