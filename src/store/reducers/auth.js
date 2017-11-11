const SET_USER = 'hci4/ui/SET_USER';

export function setUser(user) {
  return {
    type: SET_USER,
    user,
  };
}

const initialState = {
  user: null,
};

export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
}