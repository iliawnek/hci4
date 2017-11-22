const SET_TODAY = "hci4/date/SET_TODAY";

export function setToday(dateString) {
  return {
    type: SET_TODAY,
    dateString
  };
}

const initialState = {
  today: null
};

export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case SET_TODAY:
      return {
        ...state,
        today: action.dateString
      };

    default:
      return state;
  }
}
