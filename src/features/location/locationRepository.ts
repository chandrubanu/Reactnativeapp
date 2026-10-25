import { OfficeLocation } from '../../types/location';
//import { MOCK_OFFICE_LOCATIONS, MOCK_EMPLOYEE_CENTER_ASSIGNMENTS } from './mockLocations';
import { useSessionStore } from '../../store/sessionStore';

/**
 * Interface-first repository pattern: screens/hooks depend on
 * ILocationRepository, never on the implementation directly.
 */
export interface ILocationRepository {
  getAuthorizedLocationsForEmployee(employeeId: string): Promise<OfficeLocation[]>;
}

class HttpLocationRepository implements ILocationRepository {
  async getAuthorizedLocationsForEmployee(employeeId: string): Promise<OfficeLocation[]> {
    // ✅ Primary: use the office already loaded from /api/employees/me (no extra API call)
    const employee = useSessionStore.getState().employee;
    console.log('employee', employee?.office)
    if (employee?.office) {
      return [employee.office];
    }

    // No office found — return empty array as safe fallback
    return [];

    // const MOCK_OFFICE_LOCATIONS: OfficeLocation[] = [
    //   {
    //     centerId: '1',            // matches office.id from API
    //     centerCode: '1',
    //     centerName: 'Test Office',
    //     latitude: 11.9076936,
    //     longitude: 79.7583876,
    //     geofenceRadiusMeters: 50,
    //     gpsAccuracyThresholdMeters: 50,
    //     timezone: 'Asia/Kolkata',
    //     isActive: true,
    //   },
    // ];
    // const MOCK_EMPLOYEE_CENTER_ASSIGNMENTS: Record<string, string[]> = {
    //   '1': ['1'],   // employee id 1 → office id 1 (Test Office)
    //   '3': ['1'],   // employee id 3 → office id 1 (Test Office)
    // };

    // // ⚠️ Fallback: use mock data (for older tokens or missing office payload)
    // const assignedIds = MOCK_EMPLOYEE_CENTER_ASSIGNMENTS[employeeId] ?? [];
    // console.log('assignedIds', MOCK_OFFICE_LOCATIONS.filter((loc) => assignedIds.includes(loc.centerId)))
    // return MOCK_OFFICE_LOCATIONS.filter((loc) => assignedIds.includes(loc.centerId));

  }
}

// Swap this single export for a different implementation without touching
// any screen or hook — everything importing locationRepository only depends
// on ILocationRepository, not on the concrete class.
export const locationRepository: ILocationRepository = new HttpLocationRepository();
