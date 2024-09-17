import { SET_USERNAME } from "../actions/userActions";

const initialState = {
    username: '',
};

const uReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    default:
      return state;
  }
};

export default uReducer;
