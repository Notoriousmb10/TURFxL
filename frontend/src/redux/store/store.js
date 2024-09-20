import { createStore, combineReducers } from 'redux';
import userReducer from "../reducers/userReducer";
import loginStatusReducer from '../reducers/loginStatusReducer';
import { loginStatus } from '../actions/userActions';

const rootReducer = combineReducers({
    user: userReducer,
    loginStatus: loginStatusReducer

})


const store = createStore(rootReducer);
export default store;