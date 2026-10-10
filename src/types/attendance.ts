export enum AttendanceStatus {
  NOT_PUNCHED_IN = 'NOT_PUNCHED_IN',
  PUNCHED_IN = 'PUNCHED_IN',
  ON_BREAK = 'ON_BREAK',
  PUNCHED_OUT = 'PUNCHED_OUT',
  ON_LEAVE = 'ON_LEAVE',
  HOLIDAY = 'HOLIDAY',
}

export enum PunchType {
  PUNCH_IN = 'PUNCH_IN',
  PUNCH_OUT = 'PUNCH_OUT',
  BREAK_START = 'BREAK_START',
  BREAK_END = 'BREAK_END',
  FINAL_PUNCH_OUT = 'FINAL_PUNCH_OUT',
}

export interface PunchRequest {
  employeeId: string;
  punchType: PunchType;
  timestampIso: string;
  coordinates: { latitude: number; longitude: number };
  accuracyMeters: number;
  centerId: string;
  distanceMeters: number;
  isMockLocation: boolean;
  deviceId?: string;
  biometricVerified: boolean;
}

export interface PunchResponse {
  success: boolean;
  newStatus: AttendanceStatus;
  serverTimestampIso: string;
  message?: string;
  errorCode?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  punchInTime?: string;
  punchOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  centerId?: string;
  totalWorkedMinutes?: number;
}
