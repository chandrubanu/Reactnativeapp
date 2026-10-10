// Config shapes a Super Admin would manage server-side. The mobile app
// only ever reads these (via dashboardRepository / locationRepository);
// no admin write screens ship in this build, but the shapes are defined
// so backend integration in Phase-11-equivalent work has a contract.

export interface FulfillmentCenterConfig {
  centerId: string;
  centerCode: string;
  centerName: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  gpsAccuracyThresholdMeters: number;
  locationVerificationMode: 'STRICT' | 'LENIENT';
  mockLocationDetectionEnabled: boolean;
  defaultBreakDurationMinutes: number;
  timezone: string;
}

export interface AttendancePolicyConfig {
  gracePeriodMinutes: number;
  overtimeThresholdMinutes: number;
  allowMockLocation: boolean;
}
