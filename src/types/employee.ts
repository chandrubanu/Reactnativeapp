export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  designation: string;
  assignedCenterIds: string[]; // an employee can be assigned to multiple centers
  defaultShiftId: string;
  biometricEnabled: boolean;
  avatarUrl?: string;
}
