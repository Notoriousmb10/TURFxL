import { createStore, combineReducers } from 'redux';
import userReducer from "../reducers/userReducer";
import loginStatusReducer from '../reducers/loginStatusReducer';
import searchTurfReducer from '../reducers/searchTurfReducer';

const rootReducer = combineReducers({
    user: userReducer,
    loginStatus: loginStatusReducer,
    searchTurf: searchTurfReducer

})


const store = createStore(rootReducer,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;