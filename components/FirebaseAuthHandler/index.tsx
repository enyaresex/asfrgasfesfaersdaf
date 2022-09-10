import firebase from 'firebase/app';
import 'firebase/auth'; // eslint-disable-line import/no-duplicates
import 'firebase/firestore'; // eslint-disable-line import/no-duplicates
import { useContext, useEffect } from 'react';
import { AuthAndApiContext } from '../../contexts';

/**
 * Sync firebase authentication status with the local one.
 * Fetch the custom token from the API when user is signed in and authenticate with it.
 * Sign out from the firebase when user is locally signed out.
 */
export default function FirebaseAuthHandler() {
  const { api, user } = useContext(AuthAndApiContext);

  useEffect(() => {
    async function handle() {
      if (user === null && firebase.auth().currentUser !== null) {
        await firebase.auth().signOut();
      } else if (user !== null && firebase.auth().currentUser === null) {
        const response = await api.get('/users/get_firebase_access_token/');
        const responseJson = await response.json();

        if (response.ok) {
          await firebase.auth().signInWithCustomToken(responseJson.token);
        }
      }
    }

    handle();
  }, [user]);

  return null;
}
