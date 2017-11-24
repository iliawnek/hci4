import { createStore, compose } from "redux";
import reducer from "./reducers";
import {reactReduxFirebase} from 'react-redux-firebase';
import firebase from 'firebase';

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, {
    userProfile: 'users',
  }),
)(createStore)

const store = createStoreWithFirebase(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
