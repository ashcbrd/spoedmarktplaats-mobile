# SpoedMarktplaats (Mobile)

Expo + React Native mobile app for SpoedMarktplaats.

## Stack

- Expo (SDK 52), React Native, TypeScript
- React Navigation (stack + tabs)
- TanStack React Query (server state)
- Zustand (local state)
- Axios (REST) + socket.io-client (chat)

## Requirements

- Node.js >= 20 (see `package.json`)
- iOS: Xcode + CocoaPods (via Bundler)
- Android: Android Studio / SDK

## Setup

```sh
npm install
cp .env.example .env
```

Environment variables are loaded via `app.config.js` and exposed through `src/config/env.ts`.

`.env` keys:

- `API_BASE_URL` (default `http://localhost:3000`)
- `WS_URL` (default `ws://localhost:3000/chat`)
- `ENVIRONMENT` (`development` | `staging` | `production`)

## Run

```sh
# Dev server
npm start

# Native builds
npm run ios
npm run android

# Optional
npm run web
```

### iOS Pods (first run / native deps changed)

```sh
bundle install
cd ios && bundle exec pod install
```

## Quality

```sh
npm run typecheck
npm test
npm run lint
npm run format
```

## Project Layout

- `App.tsx` - providers + navigation container
- `src/navigation/*` - auth vs main navigation
- `src/api/*` - Axios client + endpoint wrappers
- `src/hooks/*` - React Query hooks / app logic
- `src/store/*` - Zustand stores (auth, notifications, credits)
- `src/theme/*` - design tokens (colors/spacing/typography)

## Docs

- UI tokens: `docs/project/ui-tokens.md`
- Month 1 scope: `docs/project/month-1-scope.md`

## Troubleshooting

- Clear Metro/Expo cache: `npm start -- -c`
