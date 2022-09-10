importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBBUnA_iPyMZAgSGtr9oqrpESqh1lOdn8s',
  authDomain: 'gamerarena-b0218.firebaseapp.com',
  databaseURL: 'https://gamerarena-b0218.firebaseio.com',
  projectId: 'gamerarena-b0218',
  storageBucket: 'gamerarena-b0218.appspot.com',
  messagingSenderId: '140126459077',
  appId: '1:140126459077:web:5faa855d2b5704820e0cac',
  measurementId: 'G-ZXQ0HMBNNL',
});

if (firebase.messaging.isSupported()) {
  firebase.messaging();
}

self.addEventListener('fetch', () => null);
