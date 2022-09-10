import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { LocalizationContext, NotificationsContext, ToastsContext } from '../../contexts';
import { getFirestoreCollection, hydrateNotification } from '../../helpers';

type Props = {
  children: React.ReactNode,
};

const notificationsCollection = getFirestoreCollection('notifications');
const notificationPageSize = 10;

export default function NotificationsHandler({ children }: Props) {
  const intl = useIntl();
  const { languageCode } = useContext(LocalizationContext);
  const { addToast } = useContext(ToastsContext);

  const [canLoadMore, setCanLoadMore] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(notificationPageSize);
  const [notifications, setNotifications] = useState<HydratedNotification[] | null>(null);
  const unsubscribe = useRef<() => void>(() => null);

  function subscribe() {
    const firebaseUser = firebase.auth().currentUser;

    if (firebaseUser === null) {
      unsubscribe.current();
    } else {
      unsubscribe.current = firebase.firestore()
        .collection(notificationsCollection)
        .doc(firebaseUser.uid)
        .collection('notifications')
        .orderBy('isUnread', 'desc')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .onSnapshot((snapshot) => {
          const newNotifications = snapshot.docs.map((d) => hydrateNotification({
            id: d.id,
            ...d.data(),
          } as FSNotification, languageCode));

          setCanLoadMore(notifications === null || newNotifications.length > notifications.length);
          setNotifications(newNotifications);
        });
    }
  }

  function loadMore() {
    setLimit((l) => l + notificationPageSize);
  }

  function markAsRead(notificationId: string): Promise<void> {
    // marking single notification as read
    const firebaseUser = firebase.auth().currentUser;

    if (firebaseUser === null) {
      return Promise.reject(new Error('User is not authenticated.'));
    }

    return firebase.firestore()
      .collection(notificationsCollection)
      .doc(firebaseUser.uid)
      .collection('notifications')
      .doc(notificationId)
      .update({ isUnread: false });
  }

  async function markAllAsRead(): Promise<void> {
    const firebaseUser = firebase.auth().currentUser;

    if (firebaseUser === null) {
      return Promise.reject(new Error('User is not authenticated.'));
    }

    const unreadNotifications = await firebase.firestore()
      .collection(notificationsCollection)
      .doc(firebaseUser?.uid)
      .collection('notifications')
      .where('isUnread', '==', true)
      .get();

    const batch = firebase.firestore().batch();

    unreadNotifications.docs.forEach((d) => {
      const notificationRef = firebase.firestore()
        .collection(notificationsCollection)
        .doc(firebaseUser.uid)
        .collection('notifications')
        .doc(d.id);

      batch.update(notificationRef, { isUnread: false });
    });

    const p = batch.commit();

    addToast({
      content: intl.formatMessage({ defaultMessage: 'All notifications are marked as read.' }),
      kind: 'success',
    });

    return p;
  }

  useEffect(() => {
    const authUnsubscribe = firebase.auth().onAuthStateChanged(subscribe);

    return () => authUnsubscribe();
  }, []);

  useEffect(() => {
    subscribe();
  }, [limit]);

  return (
    <NotificationsContext.Provider
      value={{
        canLoadMore,
        isMenuOpen,
        loadMore,
        markAllAsRead,
        markAsRead,
        notifications,
        setIsMenuOpen,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
