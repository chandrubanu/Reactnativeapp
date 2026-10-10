// Every user-facing error message lives here. Business logic / services
// should only ever throw or return one of these AppErrorCode values —
// never a raw backend/OS error string. See utils/errorMapper.ts.

export enum AppErrorCode {
  LOCATION_PERMISSION_DENIED = 'LOCATION_PERMISSION_DENIED',
  GPS_DISABLED = 'GPS_DISABLED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  POOR_ACCURACY = 'POOR_ACCURACY',
  OUTSIDE_GEOFENCE = 'OUTSIDE_GEOFENCE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  DUPLICATE_PUNCH = 'DUPLICATE_PUNCH',
  INVALID_ATTENDANCE_STATE = 'INVALID_ATTENDANCE_STATE',
  BIOMETRIC_FAILED = 'BIOMETRIC_FAILED',
  BIOMETRIC_NOT_AVAILABLE = 'BIOMETRIC_NOT_AVAILABLE',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNKNOWN = 'UNKNOWN',
}

export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  [AppErrorCode.LOCATION_PERMISSION_DENIED]:
    'Location permission is required to punch in/out. Please enable it in Settings.',
  [AppErrorCode.GPS_DISABLED]: 'Please turn on Location Services to continue.',
  [AppErrorCode.LOCATION_UNAVAILABLE]: 'Unable to get your current location. Please try again.',
  [AppErrorCode.POOR_ACCURACY]: 'GPS signal is too weak. Move to an open area and try again.',
  [AppErrorCode.OUTSIDE_GEOFENCE]: 'You are outside office radius.',
  [AppErrorCode.NETWORK_ERROR]: 'No internet connection. Please check your network and retry.',
  [AppErrorCode.SERVER_ERROR]: 'Something went wrong on our end. Please try again shortly.',
  [AppErrorCode.DUPLICATE_PUNCH]: 'This attendance action was already recorded.',
  [AppErrorCode.INVALID_ATTENDANCE_STATE]: 'This action is not allowed in your current attendance state.',
  [AppErrorCode.BIOMETRIC_FAILED]: 'Biometric verification failed. Please try again.',
  [AppErrorCode.BIOMETRIC_NOT_AVAILABLE]: 'Biometric authentication is not available on this device.',
  [AppErrorCode.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  [AppErrorCode.UNKNOWN]: 'Something went wrong. Please try again.',
};

export class AppError extends Error {
  constructor(public code: AppErrorCode, message?: string) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = 'AppError';
  }
}
