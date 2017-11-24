const SET_APPBAR_TITLE = "hci4/ui/SET_APPBAR_TITLE";
const OPEN_SIDEBAR = "hci4/ui/OPEN_SIDEBAR";
const CLOSE_SIDEBAR = "hci4/ui/CLOSE_SIDEBAR";
const SHOW_CLOSE_BUTTON = "hci4/ui/SHOW_CLOSE_BUTTON";
const HIDE_CLOSE_BUTTON = "hci4/ui/HIDE_CLOSE_BUTTON";

export function setAppBarTitle(title) {
  return {
    type: SET_APPBAR_TITLE,
    title
  };
}

export function openSidebar() {
  return {
    type: OPEN_SIDEBAR
  };
}

export function closeSidebar() {
  return {
    type: CLOSE_SIDEBAR
  };
}

export function showCloseButton(closeTo) {
  return {
    type: SHOW_CLOSE_BUTTON,
    closeTo
  };
}

export function hideCloseButton() {
  return {
    type: HIDE_CLOSE_BUTTON
  };
}

const initialState = {
  appBarTitle: "",
  sidebarOpen: false,
  closeButtonShown: false,
  closeTo: null
};

export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case SET_APPBAR_TITLE:
      return {
        ...state,
        appBarTitle: action.title
      };

    case OPEN_SIDEBAR:
      return {
        ...state,
        sidebarOpen: true
      };

    case CLOSE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: false
      };

    case SHOW_CLOSE_BUTTON:
      return {
        ...state,
        closeButtonShown: true,
        closeTo: action.closeTo
      };

    case HIDE_CLOSE_BUTTON:
      return {
        ...state,
        closeButtonShown: false,
        closeTo: null
      };

    default:
      return state;
  }
}
