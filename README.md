# FootPro — Employee Attendance App

A full front-end skeleton for the FootPro attendance app: Expo + TypeScript,
React Navigation, TanStack Query, Zustand, React Hook Form + Zod, mock
repositories for everything (auth, locations, shifts, attendance, dashboard)
so the UI runs end-to-end with realistic dummy data before any backend exists.

## Quick start

```bash
npm install
npx expo install --fix   # aligns every Expo-managed package to your installed SDK version
  npx expo start
```

> **Note on Expo Go SDK compatibility:** Expo Go on your phone only supports one SDK
> major version at a time, and Expo ships a new one every few months. This project
> targets **Expo SDK 57** (React Native 0.86, React 19.2) in `package.json`, but by
> the time you read this, your installed Expo Go app may be on a newer SDK. If you see
> an "incompatible SDK" error on launch: check your Expo Go app's SDK version (shown
> on its settings/about screen), change the `"expo"` version in `package.json` to
> match it, then run `npx expo install --fix` again — that command rewrites every
> other Expo-managed dependency (expo-location, expo-local-authentication,
> expo-secure-store, react, react-native, react-native-screens,
> react-native-safe-area-context, react-native-svg, react-native-maps) to the exact
> versions that SDK expects, so you never need to hand-pick those version numbers.

Then press `i` (iOS simulator, Mac only), `a` (Android emulator), or scan the
QR code with the **Expo Go** app on your phone.

**Demo login:** Employee Code `EMP1001`, Password `password123`

## What's real vs mocked

| Layer | Status |
|---|---|
| UI, navigation, forms, state management | Fully implemented |
| Geofence distance/accuracy math (`src/services/locationService.ts`, `src/utils/geo.ts`) | Fully implemented, real math, unit tested |
| Device GPS + biometric calls (`expo-location`, `expo-local-authentication`) | Real Expo APIs — will actually prompt for permission/biometrics on a real device or dev build (Expo Go has limited biometric support; a Development Build is recommended for full biometric testing) |
| Auth, locations, shifts, attendance, dashboard data | **Mocked** — see `src/features/*/*Repository.ts`. Each repository is defined against an interface (`IAuthRepository`, `ILocationRepository`, etc.) so swapping in real HTTP calls later means writing one new class per interface and changing one line where it's exported — no other file changes. |

## Dummy location data

Three fulfillment centers with real-world coordinates and distinct radii,
in `src/features/location/mockLocations.ts`:

- **TVM** — Trivandrum (8.5241, 76.9366), 50m radius, 4 shifts (Morning/General/Evening/Night)
- **CHN** — Chennai (13.0827, 80.2707), 100m radius, General shift 09:00–18:00
- **BLR** — Bengaluru (12.9716, 77.5946), 75m radius, General shift 08:30–17:30

The demo employee (`EMP-1001`) is assigned to TVM + CHN. Since the simulator/emulator's
GPS won't actually be at those coordinates, the dashboard will correctly show
"You are outside office radius." — that's the geofence logic working as
designed. To test the "inside radius" path:
- **iOS Simulator:** Debug menu → Location → Custom Location → enter `8.5241, 76.9366`
- **Android Emulator:** Extended controls (`...`) → Location → set the same coordinates → Send

## Project structure

```
src/
  api/            # TanStack QueryClient setup
  components/     # reusable presentational components (common/, dashboard/)
  constants/      # theme tokens, centralized error messages
  features/       # one folder per domain: auth, location, shifts, attendance, dashboard, profile
                  #   each has: mock*.ts (dummy data), *Repository.ts (interface + mock impl), use*.ts (hooks)
  navigation/     # React Navigation stack + tab navigators, typed route params
  screens/        # thin screen components that wire hooks -> presentational components
  services/       # locationService (geofence math), biometricService
  store/          # Zustand session store
  storage/        # SecureStore wrapper
  types/          # all domain TypeScript interfaces
  models/         # re-exports types/ (reserved for DTO mapping once a real API exists)
  validation/     # Zod schemas
  __tests__/      # Jest unit tests (distance/geofence boundaries, attendance state machine)
```

> **Known issue on SDK 57:** `jest-expo@57.0.0` has a reported peer-dependency
> mismatch against `react-native@0.86.x` (declares a peer on an older
> `@react-native/jest-preset`), which can make `npm install` fail with an
> `ERESOLVE` error. If that happens, install with
> `npm install --legacy-peer-deps`, or check the Expo GitHub repo for a
> patched `jest-expo` version before installing.
>
> **Also on SDK 57:** `react-test-renderer` is pinned in `package.json` to
> `19.2.3` — matching the project's `react` version exactly. Without that
> pin, npm can resolve `react-test-renderer` to a newer version (e.g.
> 19.3.0) whose own peer requirement conflicts with the React version
> Expo SDK 57 bundles, causing an `ERESOLVE` error. If you bump `react` for
> a future SDK, bump `react-test-renderer` to the identical version at the
> same time.

## Running tests

```bash
npm test
```

Covers: distance calculation accuracy, the 50m/100m/75m geofence boundary
per center, GPS-accuracy rejection, multi-location "nearest center" logic,
inactive-location handling, and every attendance state transition
(including rejected duplicate/invalid punches).

## Swapping mocks for a real backend

Each feature folder's `*Repository.ts` file exports one object implementing
an interface, e.g.:

```ts
export const authRepository: IAuthRepository = new MockAuthRepository();
```

To connect a real API, write `HttpAuthRepository implements IAuthRepository`
in the same file (or a sibling `authRepository.http.ts`), point `src/api/`
at your real base URL + fetch/axios client, and change that one line to
`new HttpAuthRepository()`. No screens, hooks, or components need to change,
because they only ever depend on the interface.

## Known gaps / intentionally out of scope for this drop

- Admin configuration **screens** (types/models for `FulfillmentCenterConfig`
  and `AttendancePolicyConfig` are defined in `src/types/admin.ts`, but no
  UI consumes them yet — natural next feature to build).
- Leave and Schedule screens are stubs (`src/screens/leave`, `src/screens/schedule`) —
  `src/types/leave.ts` and `src/features/shifts` are ready to back them.
- react-native-maps is a listed dependency (for a future "Set Current Location"
  admin map screen) but no map screen is wired up yet.
- No production build / EAS config yet (that's Phase 14 territory).
