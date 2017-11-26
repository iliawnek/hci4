import { combineReducers } from "redux";
import {firebaseReducer} from 'react-redux-firebase';
import ui from "./ui";

export default combineReducers({
  ui,
  firebase: firebaseReducer,
});
