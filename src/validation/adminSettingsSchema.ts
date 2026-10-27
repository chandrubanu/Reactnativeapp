import { z } from 'zod';
import { CenterSettings } from '../types/admin';

const time24h = /^([01]\d|2[0-3]):[0-5]\d$/;
const coord = (min: number, max: number, label: string) =>
  z.string().refine((v) => {
    const n = Number(v);
    return v.trim() !== '' && Number.isFinite(n) && n >= min && n <= max;
  }, `${label} must be between ${min} and ${max}`);

// Note: shiftEnd is NOT forced to be after shiftStart — night shifts
// (22:00 -> 07:00) legitimately cross midnight.
const centerSchema = z.object({
  centerId: z.string(),
  centerCode: z.string(),
  locationLabel: z.string(),
  isActive: z.boolean(),
  shiftStart: z.string().regex(time24h, 'Use HH:mm (24-hour)'),
  shiftEnd: z.string().regex(time24h, 'Use HH:mm (24-hour)'),
  latitude: coord(-90, 90, 'Latitude'),
  longitude: coord(-180, 180, 'Longitude'),
  geofenceRadiusMeters: z.number(),
  gpsAccuracyThresholdMeters: z.number(),
});

export const adminSettingsSchema = z.object({ centers: z.array(centerSchema) });
export type AdminSettingsFormValues = z.infer<typeof adminSettingsSchema>;

// Text inputs hold strings; the domain model holds numbers. Convert at the edges.
export const toFormValues = (centers: CenterSettings[]): AdminSettingsFormValues => ({
  centers: centers.map((c) => ({ ...c, latitude: String(c.latitude), longitude: String(c.longitude) })),
});
export const toCenterSettings = (v: AdminSettingsFormValues): CenterSettings[] =>
  v.centers.map((c) => ({ ...c, latitude: Number(c.latitude), longitude: Number(c.longitude) }));
