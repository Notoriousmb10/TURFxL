import { SET_USER_INFO } from "../actions/userActions";

const initialState = {
    username: '',
    email: '',
    photo: '',
    phoneNo: '',
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
