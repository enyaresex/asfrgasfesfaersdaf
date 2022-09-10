import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { getFirestoreCollection } from '../../helpers';
import ActivityIndicator from '../ActivityIndicator';
import MaintenancePage from '../MaintenancePage';

type Props = {
  children: React.ReactNode,
};

const firestoreCollection = getFirestoreCollection('config');

export default function MaintenanceModeHandler({ children }: Props) {
  const db = firebase.firestore();

  const [isMaintenanceModeEnabled, setIsMaintenanceModeEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = db.collection(firestoreCollection)
      .doc('config')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.data();

        setIsMaintenanceModeEnabled(data?.isMaintenanceModeEnabled === true);
      });

    return () => unsubscribe();
  }, []);

  return isMaintenanceModeEnabled === null ? (
    <ActivityIndicator takeOver />
  ) : (
    <>
      {isMaintenanceModeEnabled ? (
        <MaintenancePage />
      ) : children}
    </>
  );
}
