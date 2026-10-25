import { OfficeLocation } from '../../types/location';

/**
 * Fallback office locations — used only when the session store has no
 * `employee.office` (e.g. older token without the office payload).
 *
 * Structure mirrors the real API response from GET /api/employees/me:
 *   office.id       → centerId / centerCode  (numeric string)
 *   office.name     → centerName
 *   office.latitude / longitude / radiusMeters / timezone → geofence fields
 *
 * To add a new office: copy one block and fill in values from the API.
 */
export const MOCK_OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    centerId: '1',            // matches office.id from API
    centerCode: '1',
    centerName: 'Test Office',
    latitude: 11.9076936,
    longitude: 79.7583876,
    geofenceRadiusMeters: 50,
    gpsAccuracyThresholdMeters: 50,
    timezone: 'Asia/Kolkata',
    isActive: true,
  },
];

/**
 * Fallback assignment map: employeeId (string) → [centerId, ...]
 * centerId must match an entry in MOCK_OFFICE_LOCATIONS above.
 *
 * This is only used when employee.office is not available in the session.
 * The real assignment comes directly from the /api/employees/me `office` object.
 */
export const MOCK_EMPLOYEE_CENTER_ASSIGNMENTS: Record<string, string[]> = {
  '1': ['1'],   // employee id 1 → office id 1 (Test Office)
  '3': ['1'],   // employee id 3 → office id 1 (Test Office)
};
