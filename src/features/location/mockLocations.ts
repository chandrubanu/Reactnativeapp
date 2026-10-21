import { OfficeLocation } from '../../types/location';

/**
 * DUMMY fulfillment-center data with real-looking lat/longitude, standing
 * in for a backend `/centers` endpoint. Swap `locationRepository`'s
 * implementation for a real HTTP call later — nothing else in the app
 * needs to change, because everything depends on the OfficeLocation[]
 * shape, not on where the data comes from.
 *
 * Coordinates below are approximate real coordinates for each city
 * (Trivandrum, Chennai, Bengaluru) so the geofence math and maps behave
 * realistically during development.
 */
export const MOCK_OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    centerId: 'TVM001',
    centerCode: 'TVM',
    centerName: 'Trivandrum Fulfillment Center',
    latitude: 8.5241,
    longitude: 76.9366,
    geofenceRadiusMeters: 50,
    gpsAccuracyThresholdMeters: 30,
    timezone: 'Asia/Kolkata',
    isActive: true,
  },
  {
    centerId: 'CHN001',
    centerCode: 'CHN',
    centerName: 'Chennai Fulfillment Center',
    latitude: 13.0827,    // real Chennai coordinates
    longitude: 80.2707,
    geofenceRadiusMeters: 500,
    gpsAccuracyThresholdMeters: 500,
    timezone: 'Asia/Kolkata',
    isActive: true,
  },
  {
    centerId: 'VLR001',
    centerCode: 'VLR',
    centerName: 'villiyanur Fulfillment Center',
    latitude: 11.9048364,
    longitude: 79.6256692,
    geofenceRadiusMeters: 100,
    gpsAccuracyThresholdMeters: 70,
    timezone: 'Asia/Kolkata',
    isActive: true,
  },
];

// Mock: which centers the currently logged-in employee is assigned to.
// A real backend would return this as part of the employee profile.
export const MOCK_EMPLOYEE_CENTER_ASSIGNMENTS: Record<string, string[]> = {
  '3': ['VLR001'],
  '1': ['VLR001'],
};
