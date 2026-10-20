# Attendance-Management-System-for-School-Events
Course requirement project in Programming Languages (CS 15/L - 1831)
React-Native Project

# EVENTRA

School event attendance management system for Programming Languages (CS 15/L - 1831).

## Requirements

- Node.js 24 or a compatible current Node.js release
- npm
- A Google account configured as an OAuth test user
- Expo Go for basic mobile testing, or the EVENTRA development APK for Google sign-in on Android

## Install

```powershell
npm install
```

Create a local `.env` file in the project root. Copy `.env.example`, then replace the placeholders with the Google client IDs from Google Cloud:

```dotenv
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

The client secret is not needed by this project. Never commit `.env` or a client secret.

## Google OAuth setup

1. Create a Google Cloud project and configure the Google Auth Platform consent screen.
2. Create a Web OAuth client and add the local web origin, normally `http://localhost:8081`.
3. Create an Android OAuth client with package name `com.kenn.eventra` and the SHA-1 fingerprint for the EAS development keystore.
4. Add every Google account used for testing under **Audience > Test users**.
5. Put the Web and Android client IDs in `.env` as shown above.

Authentication uses Expo AuthSession on the client and Google ID-token verification on the API. The app requests an ID token explicitly before sending it to the backend.

The university account name convention is handled explicitly: Google `given_name` is treated as the roster last name, while Google `family_name` is treated as the given name. Officer matching is normalized for accents and punctuation, so `CABUÑAS` and `CABUNAS` match.

For an email matching `firstnameinitial.lastname.studentID.tc@umindanao.edu.ph`, the six-digit segment becomes the student ID. Other verified Google emails receive a generated six-digit ID. The officer roster is seeded automatically on API startup, and an officer's missing student ID is filled on first sign-in.

## Run the API

Open a terminal in the project root:

```powershell
npm run dev
```

The API runs at `http://localhost:3000`.

## Run on the web

Open a second terminal:

```powershell
npx expo start --web --clear
```

Open the URL printed by Expo. Test Google signup/login with an account included in Google OAuth test users.

## Run on a phone with Expo Go

Expo Go is useful for testing screens and non-Google workflows. Google Android sign-in requires the EVENTRA development APK because the Android OAuth client is registered for package `com.kenn.eventra`.

The phone and laptop must be on the same Wi-Fi network. Start the API and Metro:

```powershell
npm run dev
npx expo start --clear
```

If the phone cannot reach the API, check Windows Firewall for port `3000` and confirm the laptop's local IP in `frontend/api/config.ts`.

## Build and run the Android development APK

Install and log in to EAS once:

```powershell
npm install --global eas-cli
eas login
```

Build the development APK after the current feature work is ready:

```powershell
$env:EAS_SKIP_AUTO_FINGERPRINT = "1"
eas build --profile development --platform android --non-interactive
```

Open the EAS build link on an Android phone, install the APK, and then start Metro from the project root:

```powershell
npx expo start --dev-client --clear
```

The development APK is not standalone: it loads the JavaScript bundle from Metro and uses the API running on the laptop. Teammates can use their own cloned repository, `.env`, API, and Metro server. Their phone and laptop must share the same Wi-Fi network.

## Features

- Google signup and login for students and officers
- Seeded officer roster and student-ID extraction from university email
- Event creation, editing, archiving, and deletion workflow
- Attendance scanning, timestamp correction, and deletion
- Student and officer QR generation
- Event attendance history, including archived events

## Database notes

The SQLite database is created as `DummySample.db` unless `ATTENDANCE_DB_PATH` is set. Officer records are seeded at startup. Existing databases are migrated at startup: student attendance and IDs are preserved, password authentication is removed, and obsolete AM/PM event columns are dropped.

Each local API instance has its own SQLite database and test data.
