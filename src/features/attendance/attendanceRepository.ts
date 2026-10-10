import {
  AttendanceStatus,
  AttendanceRecord,
  PunchRequest,
  PunchResponse,
} from '../../types/attendance';
import { AppErrorCode } from '../../constants/errors';
import { getNextStatus } from './attendanceStateMachine';

export interface IAttendanceRepository {
  getTodayRecord(employeeId: string): Promise<AttendanceRecord>;
  submitPunch(request: PunchRequest): Promise<PunchResponse>;
}

// In-memory mock "database" of today's attendance per employee. A real
// repository would call the backend instead of mutating this object.
const mockTodayRecords: Record<string, AttendanceRecord> = {};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function getOrCreateRecord(employeeId: string): AttendanceRecord {
  const existing = mockTodayRecords[employeeId];
  if (existing && existing.date === todayIso()) return existing;

  const fresh: AttendanceRecord = {
    id: `att-${employeeId}-${todayIso()}`,
    employeeId,
    date: todayIso(),
    status: AttendanceStatus.NOT_PUNCHED_IN,
  };
  mockTodayRecords[employeeId] = fresh;
  return fresh;
}

class MockAttendanceRepository implements IAttendanceRepository {
  async getTodayRecord(employeeId: string): Promise<AttendanceRecord> {
    await new Promise((r) => setTimeout(r, 150));
    return { ...getOrCreateRecord(employeeId) };
  }

  async submitPunch(request: PunchRequest): Promise<PunchResponse> {
    await new Promise((r) => setTimeout(r, 400)); // simulate network call

    const record = getOrCreateRecord(request.employeeId);

    // Re-run the same state machine the UI used, server-side-style —
    // a REAL backend does this authoritatively; here we simulate that
    // authority so duplicate/invalid punches are still rejected even if
    // a client bug lets an invalid request through.
    let nextStatus: AttendanceStatus;
    try {
      nextStatus = getNextStatus(record.status, request.punchType);
    } catch {
      return {
        success: false,
        newStatus: record.status,
        serverTimestampIso: new Date().toISOString(),
        errorCode: AppErrorCode.INVALID_ATTENDANCE_STATE,
        message: 'This action is not allowed in your current attendance state.',
      };
    }

    const nowIso = new Date().toISOString();
    record.status = nextStatus;
    if (nextStatus === AttendanceStatus.PUNCHED_IN && !record.punchInTime) {
      record.punchInTime = nowIso;
    }
    if (nextStatus === AttendanceStatus.PUNCHED_OUT) {
      record.punchOutTime = nowIso;
    }
    record.centerId = request.centerId;

    return {
      success: true,
      newStatus: nextStatus,
      serverTimestampIso: nowIso,
    };
  }
}

export const attendanceRepository: IAttendanceRepository = new MockAttendanceRepository();
