import * as Location from 'expo-location';
import { AppError, AppErrorCode } from '../constants/errors';
import { distanceInMeters } from '../utils/geo';
import { OfficeLocation, LocationValidationResult, DeviceLocationSample } from '../types/location';

/**
 * LocationService — the single place that talks to the device GPS and
 * runs geofence math. Screens/hooks never call expo-location directly;
 * they call this service so the logic is reusable AND unit-testable
 * (the pure `validateAgainstLocations` function has no device dependency
 * at all — see src/__tests__/geo.test.ts for the distance/geofence tests).
 */

async function ensurePermission(): Promise<void> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new AppError(AppErrorCode.LOCATION_PERMISSION_DENIED);
  }
}

async function ensureServicesEnabled(): Promise<void> {
  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) {
    throw new AppError(AppErrorCode.GPS_DISABLED);
  }
}

async function getCurrentSample(): Promise<DeviceLocationSample> {
  await ensurePermission();
  await ensureServicesEnabled();

  let position;
  try {
    position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
  } catch {
    throw new AppError(AppErrorCode.LOCATION_UNAVAILABLE);
  }

  // Android exposes `isFromMockProvider` on the raw location object.
  // iOS does not expose an equivalent flag through Expo, so this is a
  // best-effort signal only — per your spec, the backend must never
  // trust this alone and should apply its own server-side checks.
  const isMockLocation = Boolean((position as any).mocked ?? false);

  return {
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
    accuracyMeters: position.coords.accuracy ?? Number.MAX_SAFE_INTEGER,
    timestampMs: position.timestamp,
    isMockLocation,
  };
}

/**
 * Pure function: given a sample and a list of authorized locations,
 * find the nearest one and decide if the punch should be allowed.
 * No device calls here — easy to unit test with fixed inputs.
 */
function validateAgainstLocations(
  sample: DeviceLocationSample,
  authorizedLocations: OfficeLocation[],
): LocationValidationResult {
  // Reject immediately if the OS signals a mock/spoofed provider.
  // Android sets `mocked: true` for any app using a fake-location provider;
  // the backend should apply its own server-side checks for iOS.
  if (sample.isMockLocation) {
    return {
      isInside: false,
      centerId: null,
      centerName: null,
      distanceMeters: null,
      allowedRadiusMeters: null,
      accuracyMeters: sample.accuracyMeters,
      isMockLocation: true,
    };
  }

  const activeLocations = authorizedLocations.filter((l) => l.isActive);

  if (activeLocations.length === 0) {
    return {
      isInside: false,
      centerId: null,
      centerName: null,
      distanceMeters: null,
      allowedRadiusMeters: null,
      accuracyMeters: sample.accuracyMeters,
      isMockLocation: sample.isMockLocation,
    };
  }

  // Compute distance to every assigned center, keep the nearest one —
  // per spec step 5/6: compare against every active assigned location.
  const withDistances = activeLocations.map((loc) => ({
    loc,
    distance: distanceInMeters(sample.coords, {
      latitude: loc.latitude,
      longitude: loc.longitude,
    }),
  }));

  withDistances.sort((a, b) => a.distance - b.distance);
  const nearest = withDistances[0];

  // Accuracy gate: if the device's reported accuracy radius is worse than
  // the center's configured threshold, we cannot trust the reading enough
  // to allow a punch, even if the raw coordinates look "inside".
  const accuracyOk = sample.accuracyMeters <= nearest.loc.gpsAccuracyThresholdMeters;
  const withinRadius = nearest.distance <= nearest.loc.geofenceRadiusMeters;

  return {
    isInside: accuracyOk && withinRadius,
    centerId: nearest.loc.centerId,
    centerName: nearest.loc.centerName,
    distanceMeters: nearest.distance,
    allowedRadiusMeters: nearest.loc.geofenceRadiusMeters,
    accuracyMeters: sample.accuracyMeters,
    isMockLocation: sample.isMockLocation,
  };
}

export const locationService = {
  getCurrentSample,
  validateAgainstLocations,
};
