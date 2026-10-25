import { useCallback } from 'react';
import { authRepository, LoginCredentials } from './authRepository';
import { useSessionStore } from '../../store/sessionStore';
import { secureStorage } from '../../storage/secureStorage';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';

/**
 * useAuth composes: the Zustand session store (identity) + the auth
 * repository + SecureStore (persisted token). Screens only ever call
 * useAuth() — they never touch SecureStore or the repository directly.
 *
 * NOTE: Session restoration (the /api/employees/me boot call) has been
 * intentionally moved to useSessionRestore.ts and is called ONCE at the
 * root of the component tree (RootNavigator). This prevents the API from
 * being called multiple times when multiple components use useAuth().
 */
export function useAuth() {
  const { isAuthenticated, isRestoring, employee, setSession, clearSession } =
    useSessionStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { employee: loggedInEmployee, token } = await authRepository.login(credentials);
      await secureStorage.saveToken(token);
      await secureStorage.saveEmployeeId(loggedInEmployee.id);
      setSession(loggedInEmployee, token);
      return { success: true as const };
    } catch (err) {
      const message =
        err instanceof AppError ? err.message : ERROR_MESSAGES[AppErrorCode.UNKNOWN];
      return { success: false as const, message };
    }
  }, [setSession]);

  const logout = useCallback(async () => {
    await secureStorage.clear();
    clearSession();
  }, [clearSession]);

  return { isAuthenticated, isRestoring, employee, login, logout };
}
