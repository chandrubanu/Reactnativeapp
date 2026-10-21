export type UserRole = 'EMPLOYEE' | 'SUPER_ADMIN';
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
}
