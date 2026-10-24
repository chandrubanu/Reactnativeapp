import { Platform } from 'react-native';
import { useSessionStore } from '../store/sessionStore';
import { AppError, AppErrorCode } from '../constants/errors';

/**
 * Base URL for all API calls.
 *
 * - Web (npm run web)       → localhost works fine
 * - Android emulator        → 10.0.2.2 maps to host machine localhost
 * - Physical device (WiFi)  → use your machine's actual LAN IP
 *
 * ⚠️ Change PHYSICAL_DEVICE_IP if your machine's WiFi IP changes.
 */
const PHYSICAL_DEVICE_IP = '10.216.137.85';

// export const BASE_URL =
//   Platform.OS === 'web'
//     ? 'http://localhost:8080/attendance'
//     : Platform.OS === 'android'
//       ? `http://${PHYSICAL_DEVICE_IP}:8080/attendance`   // physical device
//       : `http://${PHYSICAL_DEVICE_IP}:8080/attendance`;  // iOS physical device
export const BASE_URL = 'http://35.255.94.143:8006/attendance'

/**
 * Authenticated fetch wrapper.
 *
 * - Automatically reads the JWT token from Zustand sessionStore and
 *   injects it as `Authorization: Bearer <token>` on every request.
 * - You can override / add extra headers via `options.headers`.
 * - Throws typed `AppError` instances on network failure or non-2xx responses.
 *
 * Usage:
 *   const data = await authFetch<MyResponseType>('/api/some/endpoint');
 *   const data = await authFetch<MyType>('/api/endpoint', { method: 'POST', body: JSON.stringify(payload) });
 */
export async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Read the current token directly from the Zustand store (outside React).
  const token = useSessionStore.getState().token;
  console.log('authFetch token:', token ? 'present' : 'MISSING', '| path:', path);

  // Destructure headers out of options so we can merge them safely.
  // Spreading ...options after headers would overwrite the headers key entirely.
  const { headers: callerHeaders, ...restOptions } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Inject Bearer token if available
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Allow callers to add extra headers (but not overwrite Content-Type)
        ...(callerHeaders ?? {}),
      },
    });
    console.log('authFetch response status:', response.status, '| path:', path);
  } catch (networkErr) {
    console.log('authFetch network error:', networkErr);
    throw new AppError(AppErrorCode.NETWORK_ERROR);
  }

  if (response.status === 401) {
    console.log('authFetch: 401 Unauthorized -', path, '- token was:', token ? 'present' : 'MISSING');
    throw new AppError(AppErrorCode.SESSION_EXPIRED);
  }

  if (response.status === 403) {
    throw new AppError(AppErrorCode.FORBIDDEN);
  }

  if (!response.ok) {
    let serverMessage: string | undefined;
    let responseBody: any;
    try {
      responseBody = await response.json();
      serverMessage = responseBody?.message ?? responseBody?.error;
    } catch {
      // ignore JSON parse failure
    }
    alert(responseBody.detail)
    console.log(`authFetch: ${response.status} error on ${path}`, responseBody);
    throw new AppError(AppErrorCode.SERVER_ERROR, serverMessage);
  }

  return response.json() as Promise<T>;
}
