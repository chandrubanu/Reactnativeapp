import { CenterSettings } from '../../types/admin';
import { ShiftTemplate } from '../../types/shift';
import { Employee } from '../../types/employee';
import { AppError, AppErrorCode } from '../../constants/errors';
import { isSuperAdmin } from '../../utils/roles';
import { authFetch } from '@/api/apiClient';
import { Alert, Platform } from 'react-native';
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};
const mapOffice = (v: any): CenterSettings => ({
  centerId: String(v.id),
  centerCode: v.code ?? v.name,
  locationLabel: v.name,
  isActive: v.isActive ?? true,
  shiftStart: v.shiftStart ?? '09:00',
  shiftEnd: v.shiftEnd ?? '18:00',
  latitude: v.latitude,
  longitude: v.longitude,
  geofenceRadiusMeters: v.radiusMeters ?? 100,
  gpsAccuracyThresholdMeters: v.gpsAccuracyThresholdMeters ?? 40,
});

export interface IAdminSettingsRepository {
  getCenterSettings(actor: Employee): Promise<CenterSettings[]>;
  saveCenterSettings(actor: Employee, centers: CenterSettings[]): Promise<CenterSettings[]>;
  saveShiftTemplates(actor: Employee, shifts: ShiftTemplate[]): Promise<ShiftTemplate[]>;
  /** Read-only, no role guard — used by the employee mobile app. */
  // getAllCenters(): Promise<CenterSettings[]>;
  getAllShifts(): Promise<ShiftTemplate[]>;
  getShiftsForCenter(centerId: string): Promise<ShiftTemplate[]>;
  getShiftById(shiftId: string): Promise<ShiftTemplate | null>;
}

// ─── Center (location + geofence) data ───────────────────────────────────────
// let centerDb: CenterSettings[] = [
//   {
//     centerId: 'CHN001', centerCode: 'CHN', locationLabel: 'Chennai Fulfillment Center',
//     isActive: true, shiftStart: '12:00', shiftEnd: '18:00',
//     latitude: 12.9716, longitude: 77.5946, geofenceRadiusMeters: 100, gpsAccuracyThresholdMeters: 40,
//   },
//   {
//     centerId: 'BLR001', centerCode: 'BLR', locationLabel: 'Bengaluru Fulfillment Center',
//     isActive: true, shiftStart: '12:30', shiftEnd: '17:30',
//     latitude: 12.9716, longitude: 77.5946, geofenceRadiusMeters: 75, gpsAccuracyThresholdMeters: 35,
//   },
//   {
//     centerId: 'VLR001', centerCode: 'VLR', locationLabel: 'Villiyanur Fulfillment Center',
//     isActive: true, shiftStart: '12:00', shiftEnd: '18:00',
//     latitude: 11.9124222, longitude: 79.7625928, geofenceRadiusMeters: 200, gpsAccuracyThresholdMeters: 200,
//   },
// ];

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
class MockAdminSettingsRepository implements IAdminSettingsRepository {

  // ── Admin-gated writes ────────────────────────────────────────────────────

  async getCenterSettings(actor: Employee): Promise<CenterSettings[]> {
    assertSuperAdmin(actor);
    const response: any = await authFetch<CenterSettings>(`/api/admin/offices`);
    if (!response || !Array.isArray(response)) {
      throw new Error('Failed to fetch recent activities');
    }

    console.log("response", response.map((values: any) => ({
      centerId: values.id, centerCode: values.name, locationLabel: values.name,
      isActive: true, shiftStart: '09:00', shiftEnd: '18:00',
      latitude: values.latitude, longitude: values.longitude, geofenceRadiusMeters: values.radiusMeters, gpsAccuracyThresholdMeters: 40,
    })))
    return response.map((values: any) => ({

      centerId: String(values.id),
      centerCode: values.code ?? values.name,
      locationLabel: values.name,
      isActive: values.isActive ?? true,
      shiftStart: values.shiftStart ?? '09:00',
      shiftEnd: values.shiftEnd ?? '18:00',
      latitude: values.latitude,
      longitude: values.longitude,
      geofenceRadiusMeters: values.radiusMeters ?? 100,
      gpsAccuracyThresholdMeters: values.gpsAccuracyThresholdMeters ?? 40,
    }))
  }



  // async saveCenterSettings(actor: Employee, centers: CenterSettings[]): Promise<CenterSettings[]> {
  //   assertSuperAdmin(actor);
  //   await new Promise((r) => setTimeout(r, 400));
  //   centerDb = centers.map((c) => ({ ...c }));
  //   return centerDb.map((c) => ({ ...c }));
  // }

  async saveShiftTemplates(actor: Employee, shifts: ShiftTemplate[]): Promise<ShiftTemplate[]> {
    assertSuperAdmin(actor);
    await new Promise((r) => setTimeout(r, 400));
    shiftDb = shifts.map((s) => ({ ...s }));
    return shiftDb.map((s) => ({ ...s }));
  }

  async saveCenterSettings(
    actor: Employee,
    centers: CenterSettings[]
  ): Promise<CenterSettings[]> {
    const center = centers[0];

    const centerpayloadval = {
      name: center.locationLabel,
      latitude: Number(center.latitude),
      longitude: Number(center.longitude),
      radiusMeters: center.geofenceRadiusMeters,
      timezone: 'Asia/Kolkata',
      workingDays: [1, 2, 3, 4, 5],
      lateGraceMinutes: 15,
    };
    const response = await authFetch<CenterSettings>(
      '/api/admin/offices/' + center.centerId,
      {
        method: 'POST',
        body: JSON.stringify(centerpayloadval),
      }
    );

    // API may return an array, a single object, or nothing (204)
    let result: CenterSettings[];
    if (Array.isArray(response)) {
      result = response.map(mapOffice);
    } else if (response && typeof response === 'object') {
      result = [mapOffice(response)];
    } else {
      result = centers; // nothing returned: keep what the user submitted
    }
    showAlert('Success', 'Center settings saved successfully.');
    return result;
  } catch(e: any) {
    showAlert('Error', e?.message ?? 'Failed to save center settings.');
    throw e; // let the caller stop its loading state
  }

  // ── Mobile app read-only (no role guard) ─────────────────────────────────

  // async getAllCenters(): Promise<CenterSettings[]> {
  //   await new Promise((r) => setTimeout(r, 150));
  //   return centerDb.map((c) => ({ ...c }));
  // }

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
}

export const adminSettingsRepository: IAdminSettingsRepository = new MockAdminSettingsRepository();
