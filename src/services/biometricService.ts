import * as LocalAuthentication from 'expo-local-authentication';
import { AppError, AppErrorCode } from '../constants/errors';

/**
 * Thin wrapper around expo-local-authentication.
 *
 * IMPORTANT: this NEVER touches raw fingerprint/face data — the OS
 * (Android BiometricPrompt / iOS LocalAuthentication framework) performs
 * the actual biometric match in a secure enclave and only tells our app
 * "yes/no, this authorized user is present". FootPro never receives,
 * transmits, or stores biometric templates.
 */

export async function isBiometricAvailable(): Promise<boolean> {
  const level = await LocalAuthentication.getEnrolledLevelAsync();
  return level !== LocalAuthentication.SecurityLevel.NONE;
}


export async function hasBiometricsEnrolled(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<boolean> {
  const available = await isBiometricAvailable();
  if (!available) {
    throw new AppError(AppErrorCode.BIOMETRIC_NOT_AVAILABLE);
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    // Allows the OS fallback (device PIN/passcode) when biometrics fail
    // or are temporarily unavailable — required per your spec's
    // "provide the configured fallback authentication method".
    disableDeviceFallback: false,
    cancelLabel: 'Cancel',
  });

  if (!result.success) {
    throw new AppError(AppErrorCode.BIOMETRIC_FAILED);
  }
  return true;
}
