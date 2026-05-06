# voiceyBill-App

[![CI](https://github.com/voiceyBill/voiceyBill-App/actions/workflows/ci.yml/badge.svg)](https://github.com/voiceyBill/voiceyBill-App/actions/workflows/ci.yml)
[![CodeQL](https://github.com/voiceyBill/voiceyBill-App/actions/workflows/codeql.yml/badge.svg)](https://github.com/voiceyBill/voiceyBill-App/actions/workflows/codeql.yml)
[![Release](https://github.com/voiceyBill/voiceyBill-App/actions/workflows/release.yml/badge.svg)](https://github.com/voiceyBill/voiceyBill-App/actions/workflows/release.yml)

Mobile React Native app (Expo) for the voiceyBill platform.

## What This App Does

voiceyBill-App helps users track income and expenses with a mobile-first experience, including:

- Transaction management
- Dashboard analytics and summaries
- Voice-assisted transaction flows
- Report and category insights

## Open Source Standards

This repository is configured with professional OSS governance:

- CI checks for type safety and build validation
- PR title policy (Conventional Commits)
- PR template and issue forms (bug/feature/question)
- Dependency review and CodeQL security scanning
- Stale issue/PR management
- Release workflow support

## Tech Stack

- React Native
- Expo
- TypeScript
- Redux Toolkit + RTK Query
- React Navigation

## Prerequisites

- Node.js 20+
- npm 10+
- Git
- Android Studio (for Android emulator) and/or Xcode (for iOS simulator, macOS only)
- Expo Go app on a real device (optional but recommended)

## Quick Start

1. Install dependencies:

```bash
npm ci
```

2. Start Expo development server:

```bash
npm run start
```

3. Run on Android:

```bash
npm run android
```

4. Run on iOS (macOS only):

```bash
npm run ios
```

5. Run on web preview (optional):

```bash
npm run web
```

## Local Quality Checks

Before opening a PR, run:

```bash
npx tsc --noEmit
npm test --if-present
npm run lint --if-present
```

## Project Structure

```text
voiceyBill-App/
  App.tsx
  app.json
  src/
    components/
    context/
    features/
    lib/
    navigation/
    screens/
    store/
    theme/
    types/
```

## Configuration

- Copy values from `.env.example` to your local environment as needed.
- Do not commit secrets or credentials.

## Contribution Workflow

1. Fork the repo
2. Create a branch (`feat/...` or `fix/...`)
3. Make focused changes
4. Run local checks
5. Open a PR using the template

Detailed contribution rules are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Community & Policies

- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Support guide: [SUPPORT.md](SUPPORT.md)
- Branch protection checklist: [.github/BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md)
- Developer setup details: [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md)

## Issues and Pull Requests

- Use issue forms for bugs, features, and questions.
- PR title must follow Conventional Commits, for example:
  - `feat(mobile): add recurring transaction editor`
  - `fix(voice): handle empty transcript safely`

## Security Reporting

For vulnerabilities, do not open a public issue. Use GitHub Security Advisories as described in [SECURITY.md](SECURITY.md).

## License

No license file has been added yet. If you plan to accept broad open-source contributions, add a license (MIT/Apache-2.0 are common choices).
