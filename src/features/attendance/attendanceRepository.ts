import {
  AttendanceStatus,
  AttendanceRecord,
  PunchRequest,
  PunchResponse,
} from '../../types/attendance';
import { AppError, AppErrorCode } from '../../constants/errors';
import { authFetch } from '@/api/apiClient';

export interface IAttendanceRepository {
  getTodayRecord(employeeId: string): Promise<AttendanceRecord>;
  submitPunch(request: PunchRequest): Promise<PunchResponse>;
}

const BUTTON_ACTION_TO_STATUS: Record<string, AttendanceStatus> = {
  PUNCH_IN: AttendanceStatus.NOT_PUNCHED_IN,
  PUNCH_OUT: AttendanceStatus.PUNCHED_IN,
  BREAK_START: AttendanceStatus.PUNCHED_IN,
  BREAK_END: AttendanceStatus.ON_BREAK,
  FINAL_PUNCH_OUT: AttendanceStatus.PUNCHED_IN,
};

class MockAttendanceRepository implements IAttendanceRepository {
  async getTodayRecord(employeeId: string): Promise<AttendanceRecord> {
    try {
      const data: any = await authFetch<any>('/api/attendance/home');
      const buttonAction: string = data?.today?.buttonAction ?? data?.buttonAction ?? '';
      const status = BUTTON_ACTION_TO_STATUS[buttonAction] ?? AttendanceStatus.NOT_PUNCHED_IN;
      return {
        id: `att-${employeeId}-${data?.today?.date ?? new Date().toISOString().slice(0, 10)}`,
        employeeId,
        date: data?.today?.date ?? new Date().toISOString().slice(0, 10),
        status,
        punchInTime: data?.today?.punchInTime,
        punchOutTime: data?.today?.punchOutTime,
      };
    } catch {
      return {
        id: `att-${employeeId}-${new Date().toISOString().slice(0, 10)}`,
        employeeId,
        date: new Date().toISOString().slice(0, 10),
        status: AttendanceStatus.NOT_PUNCHED_IN,
      };
    }
  }

  async submitPunch(request: PunchRequest): Promise<PunchResponse> {
    const { punchType, coordinates, accuracyMeters, timestampIso } = request;

    // Client-side already enforces accuracy ≤ 50 m before the button is enabled.
    // We mirror that cap here so the server never sees a value > 50 m.
    // This prevents the server's secondary accuracy gate from rejecting a punch
    // that the client already validated.
    const ACCURACY_CAP_METERS = 50;
    const reportedAccuracy = Math.min(accuracyMeters, ACCURACY_CAP_METERS);

    const value = {
      action: punchType,
      location: {
        permission: 'GRANTED',
        servicesEnabled: true,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        accuracyMeters: reportedAccuracy,
        capturedAt: timestampIso,
      },
    };

    try {
      const data: any = await authFetch<PunchResponse>('/api/attendance/punch', {
        method: 'POST',
        body: JSON.stringify(value),
      });
      const response: PunchResponse = {
        success: data?.success ?? false,
        newStatus: data?.newStatus as AttendanceStatus,
        serverTimestampIso: data?.serverTimestampIso ?? new Date().toISOString(),
        message: data?.message,
        errorCode: data?.errorCode,
      };
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export const attendanceRepository: IAttendanceRepository = new MockAttendanceRepository();
