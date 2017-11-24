import { combineReducers } from "redux";
import {firebaseReducer} from 'react-redux-firebase';
import ui from "./ui";
import auth from "./auth";
import date from "./date";

export default combineReducers({
  ui,
  auth,
  date,
  firebase: firebaseReducer,
});
