import { Coordinates } from '../types/common';

/**
 * Haversine formula: great-circle distance between two lat/lng points,
 * in meters. Pure function — no React, no device APIs — so it's trivial
 * to unit test (see src/__tests__/geo.test.ts).
 *
 * Angular comparison: this is just a plain TS utility function, exactly
 * like a `pure` helper you'd put in a `utils.ts` and import directly —
 * no DI needed since it has no dependencies.
 */
export function distanceInMeters(a: Coordinates, b: Coordinates): number {
  const EARTH_RADIUS_METERS = 6371000;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return Math.round(EARTH_RADIUS_METERS * c);
}
