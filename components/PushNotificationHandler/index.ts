import firebase from 'firebase/app';
import 'firebase/messaging'; // eslint-disable-line import/no-duplicates
import { useEffect } from 'react';

export default function PushNotificationHandler() {
  function registerServiceWorkers() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js');
    }
  }

  function onMessage(payload: any) {
    const { click_action: clickAction, title } = payload.notification;

    const options = {
      body: payload.notification.body,
      icon: payload.notification.icon,
    };

    try {
      if ('Notification' in window) {
        const notification = new Notification(title, options);

        notification.onclick = function onNotificationClick() {
          if (clickAction !== undefined) {
            document.location.href = clickAction;
          }

          notification.close();
        };
      }
    } catch (e) {
      // pass
    }
  }

  useEffect(() => {
    registerServiceWorkers();

    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging();

      messaging.onMessage(onMessage);
    }
  }, []);

  return null;
}
