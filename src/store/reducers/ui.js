const SET_APPBAR_TITLE = "hci4/ui/SET_APPBAR_TITLE";
const OPEN_SIDEBAR = "hci4/ui/OPEN_SIDEBAR";
const CLOSE_SIDEBAR = "hci4/ui/CLOSE_SIDEBAR";
const SHOW_CLOSE_BUTTON = "hci4/ui/SHOW_CLOSE_BUTTON";
const HIDE_CLOSE_BUTTON = "hci4/ui/HIDE_CLOSE_BUTTON";
const SHOW_APP_BAR = "hci4/ui/SHOW_APP_BAR";
const HIDE_APP_BAR = "hci4/ui/HIDE_APP_BAR";
const SHOW_MENU_BUTTON = "hci4/ui/SHOW_MENU_BUTTON";
const HIDE_MENU_BUTTON = "hci4/ui/HIDE_MENU_BUTTON";

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

export function showAppBar() {
  return {
    type: SHOW_APP_BAR
  };
}

export function hideAppBar() {
  return {
    type: HIDE_APP_BAR
  };
}

export function showMenuButton() {
  return {
    type: SHOW_MENU_BUTTON
  };
}

export function hideMenuButton() {
  return {
    type: HIDE_MENU_BUTTON
  };
}

const initialState = {
  appBarTitle: "",
  sidebarOpen: false,
  closeButtonShown: false,
  closeTo: null,
  appBarShown: true,
  menuButtonShown: true,
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

    case SHOW_APP_BAR:
      return {
        ...state,
        appBarShown: true,
      };

    case HIDE_APP_BAR:
      return {
        ...state,
        appBarShown: false,
      };

    case SHOW_MENU_BUTTON:
      return {
        ...state,
        menuButtonShown: true,
      };

    case HIDE_MENU_BUTTON:
      return {
        ...state,
        menuButtonShown: false,
      };

    default:
      return state;
  }
}
