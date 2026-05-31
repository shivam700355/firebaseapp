# Expo Firebase Chat & Role-based App

This project is a complete Expo SDK 56 application built with Expo Router, Firebase Authentication, Firestore, and Storage.

## Features

- Role-based authentication for `admin` and `user`
- Login and registration screens
- Protected routes and role redirection
- Real-time chat list and chat details
- User management with search
- Edit profile and avatar storage support
- Firebase Firestore and Storage integration
- Clean, reusable UI components
- Responsive design for Android and iOS

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npx expo start
```

3. Open on a device or simulator

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Firebase Setup

Update `src/firebase/config.ts` with your Firebase project credentials.

## Recommended Workflow

- Keep reusable UI in `src/components`
- Use `src/context` for auth state
- Put screen routes in `src/app`
- Add business logic to `src/services`
- Use `src/hooks` for reusable hooks
- Centralize formatting in `src/utils`

## Security Rules

Firebase security rules are included in `firestore.rules` and `storage.rules`.

## Notes

This architecture is designed to be production-ready and easy to expand. Replace placeholder Firebase values with your project configuration before deploying.
