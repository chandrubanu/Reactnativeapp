import { useCallback, useEffect } from 'react';
import { authRepository, LoginCredentials } from './authRepository';
import { useSessionStore } from '../../store/sessionStore';
import { secureStorage } from '../../storage/secureStorage';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';

/**
 * useAuth composes: the Zustand session store (identity) + the auth
 * repository (mock "API") + SecureStore (persisted token). Screens only
 * ever call useAuth() — they never touch SecureStore or the repository
 * directly. This is the RN equivalent of an Angular AuthService that
 * wraps HttpClient + a token storage service behind one clean API.
 */
export function useAuth() {
  const { isAuthenticated, isRestoring, employee, setSession, clearSession, setRestoring } =
    useSessionStore();

  // Session restoration on app boot — runs once. Angular comparison:
  // similar to an APP_INITIALIZER that checks for a stored JWT before
  // the app finishes bootstrapping.
  useEffect(() => {
    (async () => {
      const token = await secureStorage.getToken();
      if (!token) {
        setRestoring(false);
        return;
      }
      try {
        const restoredEmployee = await authRepository.fetchEmployeeByToken(token);
        setSession(restoredEmployee, token);
      } catch {
        await secureStorage.clear();
      } finally {
        setRestoring(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
