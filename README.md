# Expo Firebase Chat & Role-based App

A complete Expo SDK 56 chat application using Firebase Authentication, Firestore, Storage, and Expo Notifications.

## Features

- Firebase Authentication with email/password
- Role-based auth for `admin` and `user`
- Protected routes using Expo Router
- One-to-one real-time chat with Firestore
- User listing screen and search
- Chat list screen with unread counts
- Chat detail screen with message bubble UI
- Online / offline presence tracking
- Push notifications powered by Expo Notifications and Firebase-backed tokens
- Device token saved in Firestore for notification delivery
- Notification tap opens the correct chat screen
- Clean reusable components and production-ready structure

## Folder Structure

- `src/app` - Expo Router screens and routes
- `src/components` - shared UI elements
- `src/context` - auth state provider
- `src/hooks` - reusable hooks
- `src/services` - Firebase and business logic
- `src/utils` - formatting, validation, and types
- `src/firebase/config.ts` - Firebase project configuration

## Setup Guide

1. Install dependencies:

```bash
npm install
```

2. Configure Firebase:

- Create a Firebase project.
- Enable Authentication > Email/Password.
- Create Firestore database in production mode or test mode.
- Enable Firebase Storage if you want avatar uploads.
- Add Firestore collections: `users`, `chats`, and nested `messages` under each chat.

3. Update Firebase config:

Edit `src/firebase/config.ts` with your Firebase credentials.

4. Configure notifications:

- Add your Firebase `google-services.json` for Android if using a custom build.
- Add `GoogleService-Info.plist` for iOS if required by your Expo build.
- This app uses Expo Notifications to request a device token and save it in Firestore.
- On Android, Expo uses FCM under the hood when the app is built with the correct Firebase config.

5. Start the app:

```bash
npx expo start
```

6. Run on a device or emulator:

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Firebase Collections

- `users`
  - `uid`
  - `name`
  - `email`
  - `role`
  - `status`
  - `expoPushToken`
  - `avatarUrl`
  - `createdAt`
  - `lastSeen`

- `chats`
  - `participants` (array)
  - `lastMessage`
  - `updatedAt`
  - `unread` (map by user id)

- `chats/{chatId}/messages`
  - `senderId`
  - `text`
  - `createdAt`

## Notes

- Replace placeholder Firebase credentials before launching.
- Ensure app is built with Expo or EAS to receive push notifications.
- Use `app.json` and native config files for FCM support if building for Android.
- This app is designed to be easy to extend and production-ready.
