import type { Coordinates } from './common';

export interface OfficeLocation {
  centerId: string; // e.g. "TVM", "CHN001"
  centerCode: string;
  centerName: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number; // MUST come from config, never hardcoded
  gpsAccuracyThresholdMeters: number;
  timezone: string;
  isActive: boolean;
}

export interface LocationValidationResult {
  isInside: boolean;
  centerId: string | null;
  centerName: string | null;
  distanceMeters: number | null;
  allowedRadiusMeters: number | null;
  accuracyMeters: number | null;
  isMockLocation?: boolean;
}

export interface DeviceLocationSample {
  coords: Coordinates;
  accuracyMeters: number;
  timestampMs: number;
  isMockLocation: boolean;
}

