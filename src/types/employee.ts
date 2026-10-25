import type { OfficeLocation } from './location';

export type UserRole = 'EMPLOYEE' | 'SUPER_ADMIN' | 'ADMIN';
export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  designation: string;
   role: UserRole; // drives what the user may see. Backend must ALSO enforce it.
  assignedCenterIds: string[]; // an employee can be assigned to multiple centers
  defaultShiftId: string;
  biometricEnabled: boolean;
  avatarUrl?: string;
  /** Full office/geofence data returned by /api/employees/me — no extra API call needed. */
  office?: OfficeLocation;
}
