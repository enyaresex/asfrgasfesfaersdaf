import firebase from 'firebase/app';
import 'firebase/auth'; // eslint-disable-line import/no-duplicates
import 'firebase/firestore'; // eslint-disable-line import/no-duplicates
import { useContext, useEffect } from 'react';
import { useInterval } from 'react-use';
import useSWR from 'swr';
import { AuthAndApiContext } from '../../contexts';
import { getFirestoreCollection } from '../../helpers';

const onlineUsersCollection = getFirestoreCollection('online-users');

export default function OnlineStatusHandler() {
  const { user } = useContext(AuthAndApiContext);
  const { data: country } = useSWR<Country>(user === null ? null : `/i18n/countries/${user.country}/`);
  const { data: userGames } = useSWR<UserGame[]>(user === null ? null : `/games/user_games/?user=${user.id}`);

  async function sync() {
    if (user === null || firebase.auth().currentUser === null) return;

    if (!user.isShownWhenOnline) {
      await firebase.firestore().collection(onlineUsersCollection).doc(user.id.toString()).delete();

      return;
    }

    if (userGames === undefined || country === undefined) return;

    await firebase.firestore().collection(onlineUsersCollection).doc(user.id.toString()).set({
      region: country.region,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      userGames: userGames.map((ug) => ({ game: ug.game, platform: ug.platform })),
    });
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(sync);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    sync();
  }, [user, userGames]);

  useInterval(() => {
    sync();
  }, 60000);

  return null;
}
