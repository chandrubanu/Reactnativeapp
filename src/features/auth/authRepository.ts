import { Platform } from 'react-native';
import { Employee } from '../../types/employee';
import { AppError, AppErrorCode } from '../../constants/errors';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface LoginCredentials {
  employeeCode: string;
  password: string;
}

export interface LoginResult {
  employee: Employee;
  token: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  //fetchEmployeeByToken(token: string): Promise<Employee>;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Change PHYSICAL_DEVICE_IP to your machine's WiFi IP when testing on a
 * real device. Find it by running: ipconfig (Windows) / ifconfig (Mac/Linux)
 * ⚠️  localhost does NOT work on physical phones — the phone's localhost
 *    is the phone itself, not your development machine.
 */
const PHYSICAL_DEVICE_IP = '10.216.137.85';

// export const BASE_URL =
//   Platform.OS === 'web'
//     ? 'http://localhost:8080/attendance'
//     : `http://${PHYSICAL_DEVICE_IP}:8080/attendance`;
export const BASE_URL = 'http://app.footpro.in/attendance'


// ---------------------------------------------------------------------------
// API response shapes (as the backend sends them)
// ---------------------------------------------------------------------------

/** Shape returned by POST /api/auth/login */
interface LoginApiResponse {
  accessToken: string;
}

/**
 * Shape returned by GET /api/employees/me
 * {
 *   "id": 3,
 *   "username": "rahul",
 *   "displayName": "Rahul",
 *   "department": "Unassigned",
 *   "officeId": 1,
 *   "shiftId": 1,
 *   "enabled": true,
 *   "role": "EMPLOYEE"
 * }
 */
interface MeApiResponse {
  id: number | string;
  username: string;
  displayName: string;
  department?: string;
  officeId?: number | string;
  shiftId?: number | string;
  enabled?: boolean;
  role?: string;
  email?: string;
  avatarUrl?: string;
  biometricEnabled?: boolean;
}

// ---------------------------------------------------------------------------
// Helper: unified fetch wrapper with AppError normalisation
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch {
    // Network failure (no connectivity, DNS, CORS, etc.)
    throw new AppError(AppErrorCode.NETWORK_ERROR);
  }

  if (response.status === 401) {
    throw new AppError(AppErrorCode.SERVER_ERROR, 'Invalid username or password.');
  }

  if (response.status === 403) {
    throw new AppError(AppErrorCode.FORBIDDEN);
  }

  if (!response.ok) {
    // Try to extract a backend-provided message; fall back to generic SERVER_ERROR.
    let serverMessage: string | undefined;
    try {
      const body = await response.json();
      serverMessage = body?.message ?? body?.error;
    } catch {
      // ignore JSON parse failure
    }
    throw new AppError(AppErrorCode.SERVER_ERROR, serverMessage);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Helper: map /api/employees/me response → domain Employee
// ---------------------------------------------------------------------------

function mapToEmployee(data: MeApiResponse): Employee {
  return {
    id: String(data.id ?? ''),
    employeeCode: data.username ?? '',        // backend sends "username"
    name: data.displayName ?? '',             // backend sends "displayName"
    email: data.email ?? '',
    designation: data.department ?? '',       // backend sends "department"
    role: (data.role as Employee['role']) ?? 'EMPLOYEE',
    assignedCenterIds: data.officeId != null ? [String(data.officeId)] : [],
    defaultShiftId: data.shiftId != null ? String(data.shiftId) : '',
    //biometricEnabled: data.biometricEnabled ?? false,
    biometricEnabled: true,
    avatarUrl: data.avatarUrl,
  };
}

// ---------------------------------------------------------------------------
// Real HTTP auth repository
// ---------------------------------------------------------------------------

class HttpAuthRepository implements IAuthRepository {
  /**
   * POST /api/auth/login
   * Body: { "username": "<employeeCode>", "password": "<password>" }
   *
   * The backend field is named "username" (as per the API contract).
   * We receive it from the rest of the app as "employeeCode" (domain name).
   */
  async login({ employeeCode, password }: LoginCredentials): Promise<LoginResult> {
    // Step 1: get the JWT token
    const raw = await apiFetch<LoginApiResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: employeeCode, // API contract: field name is "username"
        password,
      }),
    });

    const token = raw.accessToken;
    if (!token) {
      throw new AppError(AppErrorCode.SERVER_ERROR, 'No token received from server.');
    }

    // Step 2: fetch employee profile using the token
    const meData = await apiFetch<MeApiResponse>('/api/employees/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const employee = mapToEmployee(meData);
    return { employee, token };
  }

  /**
   * GET /api/auth/me  (or /api/employees/me)
   * Sends the stored JWT as a Bearer token to restore the session on app boot.
   *
   * If your backend does not expose a /me endpoint, decode the JWT on the
   * client side using `jwt-decode` and reconstruct the Employee from its
   * claims instead (see the commented-out fallback below).
   */
  async fetchEmployeeByToken(token: string): Promise<Employee> {
    try {
      const data = await apiFetch<MeApiResponse>('/api/employees/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return mapToEmployee(data);
    } catch (err) {
      // Any auth failure during session restore means the stored token is stale.
      if (err instanceof AppError && err.code === AppErrorCode.SERVER_ERROR) {
        throw new AppError(AppErrorCode.SESSION_EXPIRED);
      }
      throw err;
    }
  }
}

export const authRepository: IAuthRepository = new HttpAuthRepository();

