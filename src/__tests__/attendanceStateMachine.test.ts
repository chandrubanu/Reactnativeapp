import { AttendanceStatus, PunchType } from '../types/attendance';
import { getNextStatus, getPrimaryActionForStatus } from '../features/attendance/attendanceStateMachine';
import { AppError, AppErrorCode } from '../constants/errors';

describe('attendanceStateMachine.getNextStatus', () => {
  it('NOT_PUNCHED_IN + PUNCH_IN -> PUNCHED_IN', () => {
    expect(getNextStatus(AttendanceStatus.NOT_PUNCHED_IN, PunchType.PUNCH_IN)).toBe(
      AttendanceStatus.PUNCHED_IN,
    );
  });

  it('PUNCHED_IN + BREAK_START -> ON_BREAK', () => {
    expect(getNextStatus(AttendanceStatus.PUNCHED_IN, PunchType.BREAK_START)).toBe(
      AttendanceStatus.ON_BREAK,
    );
  });

  it('ON_BREAK + BREAK_END -> PUNCHED_IN', () => {
    expect(getNextStatus(AttendanceStatus.ON_BREAK, PunchType.BREAK_END)).toBe(
      AttendanceStatus.PUNCHED_IN,
    );
  });

  it('PUNCHED_IN + FINAL_PUNCH_OUT -> PUNCHED_OUT', () => {
    expect(getNextStatus(AttendanceStatus.PUNCHED_IN, PunchType.FINAL_PUNCH_OUT)).toBe(
      AttendanceStatus.PUNCHED_OUT,
    );
  });

  it('rejects a duplicate PUNCH_IN when already PUNCHED_IN', () => {
    expect(() => getNextStatus(AttendanceStatus.PUNCHED_IN, PunchType.PUNCH_IN)).toThrow(AppError);
    try {
      getNextStatus(AttendanceStatus.PUNCHED_IN, PunchType.PUNCH_IN);
    } catch (e) {
      expect((e as AppError).code).toBe(AppErrorCode.INVALID_ATTENDANCE_STATE);
    }
  });

  it('rejects any punch on a HOLIDAY', () => {
    expect(() => getNextStatus(AttendanceStatus.HOLIDAY, PunchType.PUNCH_IN)).toThrow(AppError);
  });

  it('rejects any punch when ON_LEAVE', () => {
    expect(() => getNextStatus(AttendanceStatus.ON_LEAVE, PunchType.PUNCH_IN)).toThrow(AppError);
  });

  it('rejects punching again once PUNCHED_OUT for the day', () => {
    expect(() => getNextStatus(AttendanceStatus.PUNCHED_OUT, PunchType.PUNCH_IN)).toThrow(AppError);
  });
});

describe('attendanceStateMachine.getPrimaryActionForStatus', () => {
  it('shows "Punch In" when NOT_PUNCHED_IN', () => {
    expect(getPrimaryActionForStatus(AttendanceStatus.NOT_PUNCHED_IN)?.label).toBe('Punch In');
  });

  it('shows "Punch Out" when PUNCHED_IN', () => {
    expect(getPrimaryActionForStatus(AttendanceStatus.PUNCHED_IN)?.label).toBe('Punch Out');
  });

  it('returns null (no action) when PUNCHED_OUT', () => {
    expect(getPrimaryActionForStatus(AttendanceStatus.PUNCHED_OUT)).toBeNull();
  });

  it('returns null (no action) on HOLIDAY or ON_LEAVE', () => {
    expect(getPrimaryActionForStatus(AttendanceStatus.HOLIDAY)).toBeNull();
    expect(getPrimaryActionForStatus(AttendanceStatus.ON_LEAVE)).toBeNull();
  });
});
