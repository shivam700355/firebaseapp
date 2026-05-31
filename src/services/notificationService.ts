import { db } from '@/firebase/config';
import Constants from 'expo-constants';
import { doc, updateDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  try {
    // Avoid attempting registration inside Expo Go (it no longer supports remote tokens)
    if (Constants?.appOwnership === 'expo') {
      console.info('Skipping push registration inside Expo Go');
      return null;
    }

    const Notifications = await import('expo-notifications');

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    try {
      await updateDoc(doc(db, 'users', userId), { expoPushToken: token });
    } catch (e) {
      console.warn('Failed to update user push token in Firestore', e);
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance?.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (e) {
    console.warn('registerForPushNotificationsAsync error', e);
    return null;
  }
}

export async function sendPushNotification(expoPushToken: string, title: string, body: string, data?: Record<string, unknown>) {
  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (e) {
    console.warn('sendPushNotification error', e);
  }
}

export function addNotificationResponseListener(handler: (response: any) => void) {
  if (Constants?.appOwnership === 'expo') {
    return { remove: () => {} };
  }

  let sub: { remove?: () => void } | null = null;
  (async () => {
    try {
      const Notifications = await import('expo-notifications');
      sub = Notifications.addNotificationResponseReceivedListener(handler);
    } catch (e) {
      console.warn('addNotificationResponseListener failed', e);
    }
  })();

  return {
    remove: () => sub?.remove?.(),
  };
}

export function addNotificationReceivedListener(handler: (notification: any) => void) {
  if (Constants?.appOwnership === 'expo') {
    return { remove: () => {} };
  }

  let sub: { remove?: () => void } | null = null;
  (async () => {
    try {
      const Notifications = await import('expo-notifications');
      sub = Notifications.addNotificationReceivedListener(handler);
    } catch (e) {
      console.warn('addNotificationReceivedListener failed', e);
    }
  })();

  return {
    remove: () => sub?.remove?.(),
  };
}
