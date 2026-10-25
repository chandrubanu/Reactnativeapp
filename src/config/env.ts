import { Platform } from 'react-native';

/**
 * Central API configuration.
 *
 * The BASE_URL is resolved at build time from the EXPO_PUBLIC_API_BASE_URL
 * environment variable (set in .env.local / .env.production).
 *
 * Fallback logic (if env var is not set):
 *   - Web (localhost)        → http://localhost:8080/attendance
 *   - Android emulator       → http://10.0.2.2:8080/attendance  (maps to host machine)
 *   - Physical device (WiFi) → http://<PHYSICAL_DEVICE_IP>:8080/attendance
 *
 * ──────────────────────────────────────────────────────────────────────────
 * How to configure per environment:
 *
 *   Local dev  → .env.local   → EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/attendance
 *   Production → .env.production → EXPO_PUBLIC_API_BASE_URL=https://app.footpro.in/attendance
 *
 * For physical device local testing, either:
 *   a) Set EXPO_PUBLIC_API_BASE_URL=http://<your-machine-wifi-ip>:8080/attendance in .env.local
 *   b) Or change PHYSICAL_DEVICE_IP below.
 * ──────────────────────────────────────────────────────────────────────────
 */

const PHYSICAL_DEVICE_IP = '10.216.137.85'; // ← update if your WiFi IP changes

function resolveBaseUrl(): string {
  // Expo exposes EXPO_PUBLIC_* vars at build time via process.env
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv;

  // Fallback: platform-based defaults (no env var set)
  if (Platform.OS === 'web') {
    return 'http://localhost:8080/attendance';
  }
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to reach the host machine's localhost.
    // For a physical device, use your machine's LAN IP instead.
    return `http://${PHYSICAL_DEVICE_IP}:8080/attendance`;
  }
  // iOS simulator / physical device
  return `http://${PHYSICAL_DEVICE_IP}:8080/attendance`;
}

export const BASE_URL = resolveBaseUrl();
