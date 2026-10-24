import { CenterSettings, RecentActivities,AdminDashboardCards,DashboardResponse } from '../../types/admin';
import { ShiftTemplate } from '../../types/shift';
import { Employee } from '../../types/employee';
import { AppError, AppErrorCode } from '../../constants/errors';
import { isSuperAdmin } from '../../utils/roles';
import { authFetch } from '@/api/apiClient';

export interface IAdminDashboardRepository { 
  getDashboardCount(dateLabel:string): Promise<DashboardResponse>;
  getCenterSettings(actor: Employee): Promise<CenterSettings[]>;
  saveCenterSettings(actor: Employee, centers: CenterSettings[]): Promise<CenterSettings[]>;
  saveShiftTemplates(actor: Employee, shifts: ShiftTemplate[]): Promise<ShiftTemplate[]>;
  /** Read-only, no role guard — used by the employee mobile app. */
  getAllCenters(): Promise<CenterSettings[]>;
  getAllShifts(): Promise<ShiftTemplate[]>;
  getShiftsForCenter(centerId: string): Promise<ShiftTemplate[]>;
  getShiftById(shiftId: string): Promise<ShiftTemplate | null>;
  getAllRecentActivities(): Promise<RecentActivities[]>;
  
}

// ─── Center (location + geofence) data ───────────────────────────────────────
let centerDb: CenterSettings[] = [
  {
    centerId: 'CHN001', centerCode: 'CHN', locationLabel: 'Chennai Fulfillment Center',
    isActive: true, shiftStart: '12:00', shiftEnd: '18:00',
    latitude: 12.9716, longitude: 77.5946, geofenceRadiusMeters: 100, gpsAccuracyThresholdMeters: 40,
  },
  {
    centerId: 'BLR001', centerCode: 'BLR', locationLabel: 'Bengaluru Fulfillment Center',
    isActive: true, shiftStart: '12:30', shiftEnd: '17:30',
    latitude: 12.9716, longitude: 77.5946, geofenceRadiusMeters: 75, gpsAccuracyThresholdMeters: 35,
  },
  {
    centerId: 'VLR001', centerCode: 'VLR', locationLabel: 'Villiyanur Fulfillment Center',
    isActive: true, shiftStart: '12:00', shiftEnd: '18:00',
    latitude: 11.9124222, longitude: 79.7625928, geofenceRadiusMeters: 200, gpsAccuracyThresholdMeters: 200,
  },
];

// ─── Shift templates ──────────────────────────────────────────────────────────
let shiftDb: ShiftTemplate[] = [
  {
    id: 'TVM-MORNING', centerId: 'TVM001', name: 'Morning',
    startTime: '08:00', endTime: '17:00',
    gracePeriodMinutes: 10, breakDurationMinutes: 30, crossesMidnight: false,
  },
  {
    id: 'TVM-GENERAL', centerId: 'TVM001', name: 'General',
    startTime: '09:00', endTime: '18:00',
    gracePeriodMinutes: 10, breakDurationMinutes: 30, crossesMidnight: false,
  },
  {
    id: 'TVM-EVENING', centerId: 'TVM001', name: 'Evening',
    startTime: '14:00', endTime: '23:00',
    gracePeriodMinutes: 10, breakDurationMinutes: 30, crossesMidnight: false,
  },
  {
    id: 'TVM-NIGHT', centerId: 'TVM001', name: 'Night',
    startTime: '22:00', endTime: '07:00',
    gracePeriodMinutes: 15, breakDurationMinutes: 30, crossesMidnight: true,
  },
  {
    id: 'CHN-GENERAL', centerId: 'CHN001', name: 'General',
    startTime: '12:00', endTime: '18:00',
    gracePeriodMinutes: 10, breakDurationMinutes: 45, crossesMidnight: false,
  },
  {
    id: 'BLR-GENERAL', centerId: 'BLR001', name: 'General',
    startTime: '12:30', endTime: '17:30',
    gracePeriodMinutes: 10, breakDurationMinutes: 30, crossesMidnight: false,
  },
  {
    id: 'VLR-GENERAL', centerId: 'VLR001', name: 'General',
    startTime: '12:00', endTime: '18:00',
    gracePeriodMinutes: 10, breakDurationMinutes: 30, crossesMidnight: false,
  },
];
 

// ─── Role guard ───────────────────────────────────────────────────────────────
function assertSuperAdmin(actor: Employee) {
  if (!isSuperAdmin(actor)) throw new AppError(AppErrorCode.FORBIDDEN);
}

// ─── Repository ───────────────────────────────────────────────────────────────
class MockAdminDashboardRepository implements IAdminDashboardRepository {

  // ── Admin-gated writes ────────────────────────────────────────────────────

  async getCenterSettings(actor: Employee): Promise<CenterSettings[]> {
    assertSuperAdmin(actor);
    await new Promise((r) => setTimeout(r, 250));
    return centerDb.map((c) => ({ ...c }));
  }

  async saveCenterSettings(actor: Employee, centers: CenterSettings[]): Promise<CenterSettings[]> {
    assertSuperAdmin(actor);
    await new Promise((r) => setTimeout(r, 400));
    centerDb = centers.map((c) => ({ ...c }));
    return centerDb.map((c) => ({ ...c }));
  }

  async saveShiftTemplates(actor: Employee, shifts: ShiftTemplate[]): Promise<ShiftTemplate[]> {
    assertSuperAdmin(actor);
    await new Promise((r) => setTimeout(r, 400));
    shiftDb = shifts.map((s) => ({ ...s }));
    return shiftDb.map((s) => ({ ...s }));
  }

  // ── Mobile app read-only (no role guard) ─────────────────────────────────

  async getAllCenters(): Promise<CenterSettings[]> {
    await new Promise((r) => setTimeout(r, 150));
    return centerDb.map((c) => ({ ...c }));
  }

  async getAllShifts(): Promise<ShiftTemplate[]> {
    await new Promise((r) => setTimeout(r, 100));
    return shiftDb.map((s) => ({ ...s }));
  }

  async getShiftsForCenter(centerId: string): Promise<ShiftTemplate[]> {
    await new Promise((r) => setTimeout(r, 100));
    return shiftDb.filter((s) => s.centerId === centerId).map((s) => ({ ...s }));
  }

  async getShiftById(shiftId: string): Promise<ShiftTemplate | null> {
    await new Promise((r) => setTimeout(r, 100));
    return shiftDb.find((s) => s.id === shiftId) ?? null;
  }

  //new values
 
  async getAllRecentActivities(): Promise<RecentActivities[]> {  
  const response: any = await authFetch<RecentActivities>('/api/admin/activity?officeId=1&date=2026-10-24&page=0&size=10');
  if (!response || !Array.isArray(response.items)) {
    throw new Error('Failed to fetch recent activities');
  } 
  const users = response.items; 
  
  return users.map((user: any) => ({
    id: String(user.employeeId),
    name: user.employeeName,
    avatar: '👨🏻‍💼',
    status: user.status  ,
    punchIn: user.punchInTime?new Date(user.punchInTime)
  .toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).replace(/\//g, '-'):'- - -',
    department: user.department,
  }));
}
//   async getDashboardCount(dateLabel:string): Promise<AdminDashboardCards> {  
//   const response: any = await authFetch<RecentActivities>(`/api/admin/dashboard?officeId=1&date=${dateLabel}&page=0&size=20`);
//   if (!response || !Array.isArray(response.items)) {
//     throw new Error('Failed to fetch recent activities');
//   } 
//   return response; 
// }
async getDashboardCount(dateLabel: string): Promise<DashboardResponse> {
  const response = await authFetch<DashboardResponse>(
    `/api/admin/dashboard?officeId=1&date=${encodeURIComponent(dateLabel)}&page=0&size=20`,
  );

 if (!response?.overview) {
    throw new Error('Invalid dashboard response');
  } 
  return response;
}
}

export const AdminDashboardRepository: IAdminDashboardRepository = new MockAdminDashboardRepository();
