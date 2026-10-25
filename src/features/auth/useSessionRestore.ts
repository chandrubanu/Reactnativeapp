import { useEffect } from 'react';
import { authRepository } from './authRepository';
import { useSessionStore } from '../../store/sessionStore';
import { secureStorage } from '../../storage/secureStorage';
import { AppError, AppErrorCode } from '../../constants/errors';

/**
 * useSessionRestore — call this EXACTLY ONCE, at the root of the component
 * tree (RootNavigator). It reads the stored JWT on app boot, validates it
 * against the backend (/api/employees/me), and hydrates the Zustand session
 * store.
 *
 * ⚠️  Do NOT call this inside useAuth() or any other hook/component that
 *     is used by multiple components simultaneously. Each call creates its
 *     own useEffect instance and would trigger a separate /api/employees/me
 *     request per mounted component.
 */
export function useSessionRestore() {
  const { setSession, setRestoring } = useSessionStore();

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
      } catch (err) {
        // Stale / invalid token — clear storage so the user sees Login.
        if (
          err instanceof AppError &&
          (err.code === AppErrorCode.SESSION_EXPIRED ||
            err.code === AppErrorCode.SERVER_ERROR ||
            err.code === AppErrorCode.FORBIDDEN)
        ) {
          await secureStorage.clear();
        }
        // For network errors we still clear restoring so the UI unblocks.
      } finally {
        setRestoring(false);
      }
    })();
    // Empty deps — intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
