import { DashboardSummary } from '../../types/dashboard';
import { AttendanceStatus } from '../../types/attendance';
import { authFetch } from '@/api/apiClient';
import { AppError, AppErrorCode } from '@/constants/errors';

export interface IDashboardRepository {
  getSummary(employeeId: string): Promise<DashboardSummary>;
}

class MainDashboardRepository implements IDashboardRepository {
  async getSummary(employeeId: string): Promise<DashboardSummary> {
    try {
      const data: any = await authFetch<DashboardSummary>('/api/attendance/home');
      console.log(data, "dataval")
      let todayvalue = data.today;
      let shift = todayvalue.shift;
      let daylablearray = ['M', 'T', 'W', 'T', 'F']
      const to12Hour = (time: string): string => {
        const [h, m] = time.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
      };
      return {
        employeeName: todayvalue.greetingMessage,
        dateIso: todayvalue.date,
        currentShiftLabel: shift.name,
        shiftStart: to12Hour(shift.startsAt),
        shiftEnd: to12Hour(shift.endsAt),
        attendanceStatus: AttendanceStatus.PUNCHED_IN,
        punctuality: {
          percentage: data.punctualityPercentage,
          onTimeDays: 343,
          lateDays: 1,
          periodLabel: 'This Month',
        },
        weeklyOverview: data.weeklyOverview.map((each: any, index: number) => ({
          dayLabel: daylablearray[index],
          //dayLabel: each.date.slice(-2),
          workedHours: each.workedHours,
          isToday: (todayvalue.date == each.date) ? true : false,
        })),
        performance: {
          daily: { value: 12, deltaLabel: '+2 vs prev' },
          weekly: { value: 84, targetLabel: 'On Target' },
          monthly: { value: 342, rankLabel: 'Top 5%' },
        },
      };
    } catch (err) {
      if (err instanceof AppError && err.code === AppErrorCode.SERVER_ERROR) {
        throw new AppError(AppErrorCode.SESSION_EXPIRED);
      }
      throw err;
    }
  }
}

export const dashboardRepository: IDashboardRepository = new MainDashboardRepository();
