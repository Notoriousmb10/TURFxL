import { LOGIN_STATUS } from "../actions/userActions";

const initialState = {
  isLoggedIn: false,
};

const loginStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_STATUS:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
      default:
      return state;
  }
};

export default loginStatusReducer;
