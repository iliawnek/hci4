import Firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBHEZL0d-CiO4KVawNgmTwUr5Gby_9o8uk',
  authDomain: 'hci4-170c2.firebaseapp.com',
  databaseURL: 'https://hci4-170c2.firebaseio.com',
  projectId: 'hci4-170c2',
  storageBucket: 'hci4-170c2.appspot.com',
  messagingSenderId: '79072240282',
};
Firebase.initializeApp(config);

export const db = Firebase.database();
export const auth = Firebase.auth();