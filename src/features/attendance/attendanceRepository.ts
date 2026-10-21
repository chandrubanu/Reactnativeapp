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

/**
 * Maps the API's next-action hint (buttonAction) to the employee's
 * current AttendanceStatus.
 *
 * buttonAction = what the user should do NEXT:
 *   PUNCH_IN       → not punched in yet    → NOT_PUNCHED_IN
 *   PUNCH_OUT      → currently punched in  → PUNCHED_IN
 *   BREAK_START    → punched in, no break  → PUNCHED_IN
 *   BREAK_END      → on break              → ON_BREAK
 *   FINAL_PUNCH_OUT→ back from break       → PUNCHED_IN
 */
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

      // The API returns buttonAction (next action) — map it to current status
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
    } catch (err) {
      // Fallback to NOT_PUNCHED_IN so the UI is always in a safe state
      return {
        id: `att-${employeeId}-${new Date().toISOString().slice(0, 10)}`,
        employeeId,
        date: new Date().toISOString().slice(0, 10),
        status: AttendanceStatus.NOT_PUNCHED_IN,
      };
    }
  }

  async submitPunch(request: PunchRequest): Promise<PunchResponse> {
    console.log("submitPunch", request)
    const {
      punchType,
      coordinates,
      accuracyMeters,
      timestampIso,
    } = request;
    let value = {
      "action": punchType,
      "location": {
        "permission": "GRANTED",
        "servicesEnabled": true,
        "latitude": coordinates.latitude,
        "longitude": coordinates.longitude,
        "accuracyMeters": accuracyMeters,
        "capturedAt": timestampIso
      }
    }
    console.log('Punch API response:', value);
    try {
      const data: any = await authFetch<PunchResponse>('/api/attendance/punch', {
        method: 'POST',
        body: JSON.stringify(value),
      });
      // Map the API response to the typed PunchResponse shape
      const response: PunchResponse = {
        success: data?.success ?? false,
        newStatus: data?.newStatus as AttendanceStatus,
        serverTimestampIso: data?.serverTimestampIso ?? new Date().toISOString(),
        message: data?.message,
        errorCode: data?.errorCode,
      };
      return response;
    } catch (err) {
      // Log the full error so we can see the real failure reason in Metro logs
      console.log('submitPunch error:', JSON.stringify(err), err);
      throw err;
    }
  }
}

export const attendanceRepository: IAttendanceRepository = new MockAttendanceRepository();
