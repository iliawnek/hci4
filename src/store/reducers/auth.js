const USER_LOADING = "hci4/ui/USER_LOADING";
const USER_LOADED = "hci4/ui/USER_LOADED";
const SET_USER = "hci4/ui/SET_USER";
const SET_USER_DATA = "hci4/ui/SET_USER_DATA";

export function userLoading() {
  return {
    type: USER_LOADING
  };
}

export function userLoaded() {
  return {
    type: USER_LOADED
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    user
  };
}

export function setUserData(userData) {
  return {
    type: SET_USER_DATA,
    userData
  };
}

const initialState = {
  user: null,
  userLoading: false
};

export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        userLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        userLoading: false
      };

    case SET_USER:
      return {
        ...state,
        user: action.user
      };

    case SET_USER_DATA:
      return {
        ...state,
        userData: action.userData
      };

    default:
      return state;
  }
}
