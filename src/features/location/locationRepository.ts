import { OfficeLocation } from '../../types/location';
import { MOCK_OFFICE_LOCATIONS, MOCK_EMPLOYEE_CENTER_ASSIGNMENTS } from './mockLocations';

/**
 * Interface-first repository pattern: screens/hooks depend on
 * ILocationRepository, never on MockLocationRepository directly. When a
 * real backend exists, write HttpLocationRepository implementing the same
 * interface and swap it in one place (see api/repositoryProvider.ts note
 * at the bottom of this file) — nothing else in the app changes.
 */
export interface ILocationRepository {
  getAuthorizedLocationsForEmployee(employeeId: string): Promise<OfficeLocation[]>;
}

class MockLocationRepository implements ILocationRepository {
  async getAuthorizedLocationsForEmployee(employeeId: string): Promise<OfficeLocation[]> {
    await new Promise((r) => setTimeout(r, 150)); // simulate network latency
    const assignedIds = MOCK_EMPLOYEE_CENTER_ASSIGNMENTS[employeeId] ?? [];
    return MOCK_OFFICE_LOCATIONS.filter((loc) => assignedIds.includes(loc.centerId));
  }
}

// Swap this single export for an HttpLocationRepository instance in
// Phase-11-equivalent backend integration — everything importing
// `locationRepository` keeps working unchanged.
export const locationRepository: ILocationRepository = new MockLocationRepository();
