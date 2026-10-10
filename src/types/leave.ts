export enum LeaveType {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  EARNED = 'EARNED',
  UNPAID = 'UNPAID',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Leave {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason?: string;
}
