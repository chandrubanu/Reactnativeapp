import { Employee } from '../../types/employee';
import { AppError, AppErrorCode } from '../../constants/errors';

export interface LoginCredentials {
  employeeCode: string;
  password: string;
}

export interface LoginResult {
  employee: Employee;
  token: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  fetchEmployeeByToken(token: string): Promise<Employee>;
}

// Dummy directory — stands in for a backend user table. Password is
// intentionally plain for a MOCK ONLY; a real repository would never
// see or compare plain-text passwords client-side.
const MOCK_USERS: { credentials: LoginCredentials; employee: Employee }[] = [
  {
    credentials: { employeeCode: 'EMP1001', password: '123' },
    employee: {
      id: 'EMP-1001',
      employeeCode: 'EMP1001',
      name: 'John',
      email: 'john@footpro.example',
      designation: 'Warehouse Associate',
      assignedCenterIds: ['VLR001'],
      defaultShiftId: 'TVM-GENERAL',
      biometricEnabled: true,
    },
  },
  {
    credentials: { employeeCode: 'EMP1002', password: '123' },
    employee: {
      id: 'EMP-1002',
      employeeCode: 'EMP1002',
      name: 'Peter',
      email: 'peter@footpro.example',
      designation: 'Associate',
      assignedCenterIds: ['VLR001'],
      defaultShiftId: 'TVM-GENERAL',
      biometricEnabled: true,
    },
  },
];

class MockAuthRepository implements IAuthRepository {
  async login({ employeeCode, password }: LoginCredentials): Promise<LoginResult> {
    await new Promise((r) => setTimeout(r, 300));
    const match = MOCK_USERS.find(
      (u) => u.credentials.employeeCode === employeeCode && u.credentials.password === password,
    );
    if (!match) {
      // A real API would return 401; we normalize it to SERVER_ERROR-style
      // handling here so the UI never has to branch on raw HTTP codes.
      throw new AppError(AppErrorCode.SERVER_ERROR, 'Invalid employee code or password.');
    }
    const token = `mock-token-${match.employee.id}-${Date.now()}`;
    return { employee: match.employee, token };
  }

  async fetchEmployeeByToken(token: string): Promise<Employee> {
    await new Promise((r) => setTimeout(r, 150));
    // Token format: mock-token-EMP-1001-<timestamp> → join parts [2] and [3]
    const parts = token.split('-');
    const employeeId = `${parts[2]}-${parts[3]}`;
    const match = MOCK_USERS.find((u) => u.employee.id === employeeId);
    if (!match) throw new AppError(AppErrorCode.SESSION_EXPIRED);
    return match.employee;
  }
}

export const authRepository: IAuthRepository = new MockAuthRepository();
