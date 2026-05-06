# Development Setup Guide

This document provides a complete setup guide for contributors working on `voiceyBill-App`.

## 1. System Requirements

- Node.js 20+
- npm 10+
- Git
- One of:
  - Android Studio + Android Emulator
  - Xcode + iOS Simulator (macOS only)
  - Physical device with Expo Go

## 2. Clone and Install

```bash
git clone https://github.com/voiceyBill/voiceyBill-App.git
cd voiceyBill-App
npm ci
```

## 3. Environment Variables

Use `.env.example` as the source of required variables.

- Create a local env file if needed by your setup.
- Keep secrets out of git.

## 4. Run the App

Start Metro/Expo:

```bash
npm run start
```

Run target platforms:

```bash
npm run android
npm run ios
npm run web
```

## 5. Type Safety and Tests

Run before every PR:

```bash
npx tsc --noEmit
npm test --if-present
npm run lint --if-present
```

## 6. Suggested Contributor Workflow

1. Sync with `main`
2. Create branch from `main`
3. Keep commit history clean and focused
4. Rebase or merge latest `main` before opening PR
5. Open PR with checklist completed

## 7. Troubleshooting

### Dependency issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### Expo cache issues

```bash
npx expo start -c
```

### TypeScript build issues

```bash
npx tsc --noEmit
```

Fix reported errors before pushing.

## 8. CI Expectations

Your PR must pass:

- Type check
- Performance monitoring type-safety check
- CodeQL analysis
- Dependency review
- PR title validation

## 9. PR Quality Bar

- Clear title in Conventional Commits format
- Linked issue where relevant
- Screenshots/video for UI changes
- No secrets in code/logs
- Documentation updated when behavior changes
