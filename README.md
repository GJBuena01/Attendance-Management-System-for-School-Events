# Attendance-Management-System-for-School-Events
Course requirement project in Programming Languages (CS 15/L - 1831)
React-Native Project

## Google authentication

Authentication uses Expo AuthSession on the client and Google ID-token verification on the API.

1. Create a Google OAuth web client in Google Cloud Console.
2. Copy `.env.example` to `.env` and set the backend, web, Android, and iOS client IDs that apply to your build. Do not commit `.env` or client secrets.
3. Start the API with `npm run dev` and the app with `npx expo start --web`.

The Google profile convention used by the university accounts is handled explicitly: Google `given_name` is treated as the roster last name, while Google `family_name` is treated as the given name. Officer matching is normalized for accents and punctuation, so `CABUÑAS` and `CABUNAS` match.

For an email matching `firstnameinitial.lastname.studentID.tc@umindanao.edu.ph`, the six-digit segment becomes the student ID. Other verified Google emails receive a generated six-digit ID. The officer roster is seeded automatically on API startup, and an officer's missing student ID is filled on first sign-in.

Existing databases are migrated at startup. Student attendance records and existing student IDs are preserved, while password authentication and the legacy password column are removed.
