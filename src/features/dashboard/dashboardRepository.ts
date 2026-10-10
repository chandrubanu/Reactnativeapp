import { DashboardSummary } from '../../types/dashboard';
import { AttendanceStatus } from '../../types/attendance';

export interface IDashboardRepository {
  getSummary(employeeId: string): Promise<DashboardSummary>;
}

/**
 * Mock dashboard data shaped to match the reference screenshot: 98%
 * punctuality, weekly bar chart, daily/weekly/monthly performance
 * numbers. A real backend computes punctuality/performance server-side
 * (per your spec — the app never derives these authoritative numbers
 * itself); this mock simply returns pre-computed values as if the
 * backend had already done that work.
 */
class MockDashboardRepository implements IDashboardRepository {
  async getSummary(employeeId: string): Promise<DashboardSummary> {
    await new Promise((r) => setTimeout(r, 200));

    return {
      employeeName: 'Demo name',
      dateIso: new Date().toISOString(),
      currentShiftLabel: 'General',
      shiftStart: '09:00 AM',
      shiftEnd: '06:00 PM',
      attendanceStatus: AttendanceStatus.NOT_PUNCHED_IN,
      punctuality: {
        percentage: 12,
        onTimeDays: 343,
        lateDays: 1,
        periodLabel: 'This Month',
      },
      weeklyOverview: [
        { dayLabel: 'M', workedHours: 8, isToday: false },
        { dayLabel: 'T', workedHours: 7.5, isToday: false },
        { dayLabel: 'W', workedHours: 9, isToday: true },
        { dayLabel: 'T', workedHours: 0, isToday: false },
        { dayLabel: 'F', workedHours: 0, isToday: false },
      ],
      performance: {
        daily: { value: 12, deltaLabel: '+2 vs prev' },
        weekly: { value: 84, targetLabel: 'On Target' },
        monthly: { value: 342, rankLabel: 'Top 5%' },
      },
    };
  }
}

export const dashboardRepository: IDashboardRepository = new MockDashboardRepository();
