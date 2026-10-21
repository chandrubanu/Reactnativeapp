import { distanceInMeters } from '../utils/geo';
import { locationService } from '../services/locationService';
import { OfficeLocation, DeviceLocationSample } from '../types/location';

const BASE_LOCATION: OfficeLocation = {
  centerId: 'TEST001',
  centerCode: 'TST',
  centerName: 'Test Center',
  latitude: 8.5241,
  longitude: 76.9366,
  geofenceRadiusMeters: 50,
  gpsAccuracyThresholdMeters: 30,
  timezone: 'Asia/Kolkata',
  isActive: true,
};

// Small helper: offset a lat/lng point by roughly N meters north, using
// the approximation 1 degree latitude ≈ 111,320 meters. Good enough for
// generating deterministic test fixtures at known distances.
function offsetByMeters(lat: number, lng: number, meters: number) {
  const metersPerDegree = 111320;
  return { latitude: lat + meters / metersPerDegree, longitude: lng };
}

describe('distanceInMeters', () => {
  it('returns ~0 for identical coordinates', () => {
    const d = distanceInMeters(
      { latitude: BASE_LOCATION.latitude, longitude: BASE_LOCATION.longitude },
      { latitude: BASE_LOCATION.latitude, longitude: BASE_LOCATION.longitude },
    );
    expect(d).toBe(0);
  });

  it('is approximately correct for a known offset (~30m)', () => {
    const point = offsetByMeters(BASE_LOCATION.latitude, BASE_LOCATION.longitude, 30);
    const d = distanceInMeters(
      { latitude: BASE_LOCATION.latitude, longitude: BASE_LOCATION.longitude },
      point,
    );
    expect(d).toBeGreaterThanOrEqual(28);
    expect(d).toBeLessThanOrEqual(32);
  });
});

describe('locationService.validateAgainstLocations — geofence boundary', () => {
  function sampleAt(distanceMeters: number, accuracyMeters = 5): DeviceLocationSample {
    const point = offsetByMeters(BASE_LOCATION.latitude, BASE_LOCATION.longitude, distanceMeters);
    return {
      coords: point,
      accuracyMeters,
      timestampMs: Date.now(),
      isMockLocation: false,
    };
  }

  it('allows a punch at 30m when radius is 50m', () => {
    const result = locationService.validateAgainstLocations(sampleAt(30), [BASE_LOCATION]);
    expect(result.isInside).toBe(true);
  });

  it('rejects a punch at 51m when radius is 50m', () => {
    const result = locationService.validateAgainstLocations(sampleAt(51), [BASE_LOCATION]);
    expect(result.isInside).toBe(false);
  });

  it('rejects when distance is within radius but GPS accuracy exceeds threshold', () => {
    // distance 30m (within 50m radius) but accuracy 100m > 30m threshold
    const result = locationService.validateAgainstLocations(sampleAt(30, 100), [BASE_LOCATION]);
    expect(result.isInside).toBe(false);
    expect(result.isAccuracyAcceptable).toBe(false);
    expect(result.accuracyThresholdMeters).toBe(BASE_LOCATION.gpsAccuracyThresholdMeters);
  });

  it('respects a configurable (non-50m) radius, e.g. 100m for CHN-style center', () => {
    const wideCenter: OfficeLocation = { ...BASE_LOCATION, geofenceRadiusMeters: 100 };
    const result = locationService.validateAgainstLocations(sampleAt(80), [wideCenter]);
    expect(result.isInside).toBe(true);
  });

  it('picks the nearest of multiple assigned locations', () => {
    const farCenter: OfficeLocation = {
      ...BASE_LOCATION,
      centerId: 'FAR001',
      centerName: 'Far Center',
      latitude: BASE_LOCATION.latitude + 1, // ~111km away
    };
    const result = locationService.validateAgainstLocations(sampleAt(20), [
      farCenter,
      BASE_LOCATION,
    ]);
    expect(result.centerId).toBe(BASE_LOCATION.centerId);
    expect(result.isInside).toBe(true);
  });

  it('returns not-inside when employee has no active assigned locations', () => {
    const result = locationService.validateAgainstLocations(sampleAt(10), []);
    expect(result.isInside).toBe(false);
    expect(result.centerId).toBeNull();
  });

  it('ignores inactive locations even if the employee is standing on top of them', () => {
    const inactiveCenter: OfficeLocation = { ...BASE_LOCATION, isActive: false };
    const result = locationService.validateAgainstLocations(sampleAt(0), [inactiveCenter]);
    expect(result.isInside).toBe(false);
  });
});
