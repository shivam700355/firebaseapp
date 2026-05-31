import { useAuth } from '@/context/AuthContext';
import { addNotificationReceivedListener, addNotificationResponseListener, registerForPushNotificationsAsync } from '@/services/notificationService';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (Constants?.appOwnership === 'expo') return; // skip in Expo Go

    let responseSub: { remove?: () => void } | null = null;
    let receivedSub: { remove?: () => void } | null = null;

    (async () => {
      try {
        await registerForPushNotificationsAsync(user.uid);
      } catch (e) {
        console.warn('registerForPushNotificationsAsync failed', e);
      }

      responseSub = addNotificationResponseListener((response) => {
        const data = (response?.notification?.request?.content as any)?.data;
        const chatId = data?.chatId as string | undefined;
        if (chatId) {
          const base = user?.role === 'admin' ? '/admin' : '/user';
          router.push(`${base}/chat/${chatId}`);
        }
      });

      receivedSub = addNotificationReceivedListener(() => {
        // Could show an in-app banner or update UI on receipt
      });
    })();

    return () => {
      responseSub?.remove?.();
      receivedSub?.remove?.();
    };
  }, [user]);
};
