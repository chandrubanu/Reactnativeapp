import { Employee } from '../../types/employee';
import { authRepository } from '../auth/authRepository';

// Thin wrapper so "profile" reads go through their own feature module
// even though, in the mock, the data source is the same as auth.
// A real backend would likely have a separate /profile endpoint —
// keeping this separated from auth now avoids a refactor later.
export interface IProfileRepository {
  getProfile(token: string): Promise<Employee>;
}

class MockProfileRepository implements IProfileRepository {
  async getProfile(token: string): Promise<Employee> {
    return authRepository.fetchEmployeeByToken(token);
  }
}

export const profileRepository: IProfileRepository = new MockProfileRepository();
