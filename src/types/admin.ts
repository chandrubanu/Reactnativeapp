// Config shapes a Super Admin would manage server-side. The mobile app
// only ever reads these (via dashboardRepository / locationRepository);
// no admin write screens ship in this build, but the shapes are defined

import { colors } from "@/constants/theme";
import { Octicons } from "@expo/vector-icons";

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
// What the Super Admin "Settings" screen edits for each fulfillment center.
export interface CenterSettings {
  centerId: string;
  centerCode: string; // "TVM"
  locationLabel: string; // "Trivandrum Fulfillment Center"
  isActive: boolean;
  shiftStart: string; // "HH:mm" 24h, center-local time
  shiftEnd: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number; // carried through unchanged by this screen
  gpsAccuracyThresholdMeters: number; // carried through unchanged by this screen
}
export interface RecentActivities {
    id: string,
    name: string,
    status: string,
    punchIn: string,
    department: string,
    avatar: '👨🏻‍💼',
}
export interface AdminDashboardCards{
  title: string, count: number,  icon: keyof typeof Octicons.glyphMap; percentage: string ,color:keyof typeof colors}