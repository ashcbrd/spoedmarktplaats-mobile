# SpoedMarktplaats (Mobile)

Expo + React Native mobile app for the SpoedMarktplaats marketplace.

## Tech Stack

- **Framework**: Expo SDK 52, React Native 0.76, TypeScript
- **Navigation**: React Navigation 7 (native stack + bottom tabs)
- **Server state**: TanStack React Query v5
- **Local state**: Zustand v5
- **HTTP client**: Axios
- **Real-time**: socket.io-client (chat)
- **Forms**: React Hook Form + Zod
- **Secure storage**: expo-secure-store (tokens), AsyncStorage (general)

---

## Prerequisites

### All platforms

| Tool | Min version | Install |
|------|-------------|---------|
| Node.js | 20 | [nodejs.org](https://nodejs.org) or `nvm install 20` |
| npm | 10 | Bundled with Node.js |

### iOS (macOS only)

| Tool | Notes |
|------|-------|
| Xcode | Install from the Mac App Store. Open it once to accept the license agreement. |
| Xcode Command Line Tools | Run `xcode-select --install` in a terminal |
| CocoaPods | Managed via Bundler — no global install needed (see step 3) |
| Ruby >= 2.6 | Pre-installed on macOS; use `rbenv` if you need a specific version |

### Android

| Tool | Notes |
|------|-------|
| Android Studio | [developer.android.com/studio](https://developer.android.com/studio) |
| Android SDK | Install via Android Studio → SDK Manager (API level 33 recommended) |
| Java 17 | Bundled with Android Studio |
| Android emulator or physical device | API 33 (Android 13) or higher recommended |

> **Backend dependency**: The [spoedmarktplaats-backend](../spoedmarktplaats-backend/README.md) must be running locally before starting the app. Follow its README to get Postgres, Redis, MinIO, and the API server up first.

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `http://localhost:3000/api/v1` | Backend REST API base URL |
| `WS_URL` | `ws://localhost:3000/chat` | WebSocket endpoint for chat |
| `ENVIRONMENT` | `development` | `development` \| `staging` \| `production` |

Environment variables are loaded by `app.config.js` into `expo.extra` and accessed in code via `src/config/env.ts`.

> **Android emulator**: Emulators cannot reach `localhost` on the host machine. Use `10.0.2.2` instead:
> ```dotenv
> API_BASE_URL=http://10.0.2.2:3000/api/v1
> WS_URL=ws://10.0.2.2:3000/chat
> ```

> **Physical device**: Replace `localhost` with your machine's LAN IP address (e.g. `192.168.1.100`). Find it with `ifconfig` (macOS/Linux) or `ipconfig` (Windows). Both device and machine must be on the same network.

---

## 3. iOS Setup (macOS only)

Install CocoaPods (via Bundler) and all native iOS dependencies. Run this once after `npm install`, and again whenever a new native module is added:

```bash
bundle install
cd ios && bundle exec pod install && cd ..
```

---

## 4. Run the App

### iOS Simulator (macOS only)

```bash
npm run ios
```

Builds the app and launches it in the iOS Simulator. Xcode must be installed.

### Android Emulator

1. Open Android Studio → **Device Manager** → start a virtual device (API 33+)
2. Run:

```bash
npm run android
```

### Expo Go (quick preview — limited)

```bash
npm start
```

Scan the QR code with the Expo Go app (iOS/Android). Note that some native modules used in this project (`expo-secure-store`, `react-native-date-picker`) **require a custom native build and will not work in Expo Go**. Use the iOS or Android commands above for full functionality.

### Web (limited support)

```bash
npm run web
```

---

## 5. Development Workflow

Metro bundler starts automatically with any of the run commands. Useful keyboard shortcuts in the Metro terminal:

| Key | Action |
|-----|--------|
| `r` | Reload the app |
| `m` | Toggle developer menu |
| `j` | Open JavaScript debugger |
| `Ctrl+C` | Stop Metro |

### Clear the Metro cache

Use this when you see stale bundle issues or after changing native dependencies:

```bash
npm start -- --reset-cache
```

---

## All NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo Metro bundler |
| `npm run ios` | Build and run on iOS Simulator |
| `npm run android` | Build and run on Android emulator or device |
| `npm run web` | Start Expo web server |
| `npm run typecheck` | Type-check all TypeScript without emitting |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier on all source files |
| `npm test` | Run Jest unit tests |

---

## Project Structure

```
SpoedMarktplaats/
├── App.tsx                      # Root component — providers + navigation container
├── app.config.js                # Expo config (reads .env into expo.extra)
├── index.js                     # App entry point
├── babel.config.js              # Babel / Metro configuration
├── metro.config.js              # Metro bundler configuration
├── jest.config.js               # Jest configuration
├── tsconfig.json                # TypeScript configuration
├── Gemfile                      # Ruby gems (CocoaPods via Bundler)
├── assets/                      # App icon, splash screen, fonts
├── ios/                         # Native iOS project (Xcode / Pods)
├── android/                     # Native Android project (Gradle)
└── src/
    ├── api/                     # Axios client + typed endpoint wrappers
    ├── components/              # Shared UI components
    ├── config/
    │   └── env.ts               # Typed access to expo-constants (sourced from .env)
    ├── hooks/                   # React Query hooks + business logic
    ├── i18n/                    # Internationalisation strings
    ├── navigation/              # Auth navigator vs main navigator + tab structure
    ├── screens/                 # Screen components organised by feature
    ├── services/                # Socket.io chat service
    ├── store/                   # Zustand stores (auth, notifications, credits)
    ├── theme/                   # Design tokens: colours, spacing, typography
    ├── types/                   # Shared TypeScript types / interfaces
    └── utils/                   # Helper utilities
```

---

## Troubleshooting

### "Unable to resolve module" or red screen on launch

Clear Metro cache:
```bash
npm start -- --reset-cache
```

### iOS build fails with CocoaPods errors

Deintegrate and reinstall pods:
```bash
cd ios
bundle exec pod deintegrate
bundle exec pod install
cd ..
```

If errors persist, update the pod specs repo:
```bash
cd ios && bundle exec pod repo update && bundle exec pod install && cd ..
```

### Android build fails with Gradle errors

Clean the Gradle build cache:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### "Network request failed" — cannot reach the backend

1. Confirm the backend is running: `curl http://localhost:3000/health`
2. For Android emulator, change `localhost` to `10.0.2.2` in `.env`
3. For a physical device, use your machine's LAN IP address in `.env`

### Some features not working in Expo Go

This project uses native modules that require a custom build. Run `npm run ios` or `npm run android` instead of using Expo Go.

### Metro bundler appears stuck

Kill any leftover Metro processes and restart with a clean cache:
```bash
npx kill-port 8081
npm start -- --reset-cache
```

### Simulator/emulator not detected

- **iOS**: Run `xcrun simctl list devices` to confirm a simulator is available
- **Android**: Confirm the emulator is running in Android Studio's Device Manager, then re-run `npm run android`

---

## Docs

- UI design tokens: `docs/project/ui-tokens.md`
- Month 1 scope: `docs/project/month-1-scope.md`
