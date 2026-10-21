import { AttendanceStatus, PunchType } from '../../types/attendance';
import { AppError, AppErrorCode } from '../../constants/errors';

/**
 * Pure state machine: given the CURRENT status and a requested punch
 * type, returns the NEXT status — or throws INVALID_ATTENDANCE_STATE if
 * that transition isn't allowed. No React, no network — fully unit
 * testable in isolation (see __tests__/attendanceStateMachine.test.ts).
 *
 * This is the single source of truth for "what buttons/actions make
 * sense right now" on the client. The backend re-validates the same
 * rules server-side (per your spec: backend is authoritative) — this
 * mirrors that logic so the UI can give instant, correct feedback
 * without waiting on a round trip for every state check.
 */
const ALLOWED_TRANSITIONS: Record<AttendanceStatus, PunchType[]> = {
  [AttendanceStatus.NOT_PUNCHED_IN]: [PunchType.PUNCH_IN],
  [AttendanceStatus.PUNCHED_IN]: [PunchType.BREAK_START, PunchType.FINAL_PUNCH_OUT],
  [AttendanceStatus.ON_BREAK]: [PunchType.BREAK_END],
  [AttendanceStatus.PUNCHED_OUT]: [],
  [AttendanceStatus.ON_LEAVE]: [],
  [AttendanceStatus.HOLIDAY]: [],
  [AttendanceStatus.ABSENT]: [],
};

export function getNextStatus(
  currentStatus: AttendanceStatus,
  punchType: PunchType,
): AttendanceStatus {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(punchType)) {
    throw new AppError(AppErrorCode.INVALID_ATTENDANCE_STATE);
  }

  switch (punchType) {
    case PunchType.PUNCH_IN:
      return AttendanceStatus.PUNCHED_IN;
    case PunchType.BREAK_START:
      return AttendanceStatus.ON_BREAK;
    case PunchType.BREAK_END:
      return AttendanceStatus.PUNCHED_IN;
    case PunchType.FINAL_PUNCH_OUT:
      return AttendanceStatus.PUNCHED_OUT;
    default:
      throw new AppError(AppErrorCode.INVALID_ATTENDANCE_STATE);
  }
}

/** What the main action button should say/do for a given status. */
export function getPrimaryActionForStatus(
  status: AttendanceStatus,
): { label: string; punchType: PunchType } | null {
  switch (status) {
    case AttendanceStatus.NOT_PUNCHED_IN:
      return { label: 'Punch In', punchType: PunchType.PUNCH_IN };
    case AttendanceStatus.PUNCHED_IN:
      return { label: 'Punch Out', punchType: PunchType.PUNCH_OUT };
    case AttendanceStatus.ON_BREAK:
      return { label: 'Punch In (End Break)', punchType: PunchType.BREAK_END };
    default:
      return null; // PUNCHED_OUT / ON_LEAVE / HOLIDAY -> no action available
  }
}
