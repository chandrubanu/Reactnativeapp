import { Employee } from '../types/employee';

// UI-level role check. This only decides what to SHOW. The real
// protection must be the backend rejecting admin API calls from
// non-super-admin tokens (the mock repository simulates that).
export function isSuperAdmin(employee: Employee | null | undefined): boolean {
  return employee?.role === 'SUPER_ADMIN';
}
