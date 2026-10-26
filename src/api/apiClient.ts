import { BASE_URL } from '../config/env';
import { useSessionStore } from '../store/sessionStore';
import { AppError, AppErrorCode } from '../constants/errors';

// BASE_URL is resolved from EXPO_PUBLIC_API_BASE_URL env variable.
// Configure it in .env.local (dev) or .env.production (prod).
// See src/config/env.ts for full details.
export { BASE_URL };

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
  } catch (networkErr) {
    throw new AppError(AppErrorCode.NETWORK_ERROR);
  }

  if (response.status === 401) {
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
    throw new AppError(AppErrorCode.SERVER_ERROR, serverMessage);
  }

  return response.json() as Promise<T>;
}
