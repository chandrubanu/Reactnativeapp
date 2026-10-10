import { create } from 'zustand';
import { Employee } from '../types/employee';

/**
 * Zustand store for auth/session — the ONE piece of truly global client
 * state in the app (who is logged in, are we authenticated). Compare to
 * Angular: this plays the role of a small NgRx slice or a singleton
 * AuthService with a BehaviorSubject<AuthState> — except there's no
 * boilerplate: no actions/reducers/selectors ceremony, just a hook.
 *
 * Per the architecture rule "do not put every API response into global
 * Zustand state" — dashboard/attendance/shift DATA lives in TanStack
 * Query's cache (see features/use.ts), NOT here. This store only
 * holds session identity.
 */
interface SessionState {
  isAuthenticated: boolean;
  isRestoring: boolean; // true while we check for a saved session on app boot
  employee: Employee | null;
  token: string | null;
  setSession: (employee: Employee, token: string) => void;
  clearSession: () => void;
  setRestoring: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  isRestoring: true,
  employee: null,
  token: null,
  setSession: (employee, token) => set({ employee, token, isAuthenticated: true }),
  clearSession: () => set({ employee: null, token: null, isAuthenticated: false }),
  setRestoring: (value) => set({ isRestoring: value }),
}));
