import { createStore, compose } from "redux";
import reducer from "./reducers";
import {reactReduxFirebase} from 'react-redux-firebase';
import firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyBHEZL0d-CiO4KVawNgmTwUr5Gby_9o8uk",
  authDomain: "hci4-170c2.firebaseapp.com",
  databaseURL: "https://hci4-170c2.firebaseio.com",
  projectId: "hci4-170c2",
  storageBucket: "hci4-170c2.appspot.com",
  messagingSenderId: "79072240282"
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, {
    userProfile: 'users',
  }),
)(createStore)

const store = createStoreWithFirebase(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
