import { combineReducers } from "redux";
import ui from "./ui";
import auth from "./auth";
import date from "./date";

export default combineReducers({
  ui,
  auth,
  date
});
