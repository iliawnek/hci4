const SET_APPBAR_TITLE = 'hci4/ui/SET_APPBAR_TITLE';

export function setAppBarTitle(title) {
  return {
    type: SET_APPBAR_TITLE,
    title,
  };
}

const initialState = {
  appBarTitle: "Running",
};

export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case SET_APPBAR_TITLE:
      return {
        ...state,
        appBarTitle: action.title,
      };

    default:
      return state;
  }
}