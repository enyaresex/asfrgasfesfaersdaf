import dayjs from 'dayjs';
import firebase from 'firebase/app';
import 'firebase/firestore'; // eslint-disable-line import/no-duplicates
import omit from 'lodash/omit';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useInterval } from 'react-use';
import {
  AuthAndApiContext,
  OnlineUsersContext,
  OnlineUsersContextOnlineUser,
  OnlineUsersContextValue,
  RegionContext,
} from '../../contexts';
import { getFirestoreCollection } from '../../helpers';

type Props = {
  children: React.ReactNode,
};

const onlineUsersCollection = getFirestoreCollection('online-users');

export default function OnlineUsersHandler({ children }: Props) {
  const { user } = useContext(AuthAndApiContext);
  const { region } = useContext(RegionContext);

  const unsubscribe = useRef<() => void>(() => null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsersContextValue['onlineUsers']>([]);

  function subscribe() {
    if (user === null || firebase.auth().currentUser === null) return;

    if (unsubscribe.current !== null) unsubscribe.current();

    unsubscribe.current = firebase.firestore().collection(onlineUsersCollection)
      .where('region', '==', region.id)
      .where('timestamp', '>', dayjs().subtract(5, 'minute').toDate())
      .onSnapshot((snapshot) => {
        setOnlineUsers(snapshot.docs.map((d) => ({ userId: parseInt(d.id), ...omit(d.data()) } as OnlineUsersContextOnlineUser)));
      });
  }

  useEffect(() => {
    subscribe();
    const authUnsubscribe = firebase.auth().onAuthStateChanged(() => subscribe());

    if (unsubscribe.current !== null) {
      authUnsubscribe();
      unsubscribe.current();
    }
  }, []);

  useInterval(() => {
    subscribe();
  }, 30000);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
}
