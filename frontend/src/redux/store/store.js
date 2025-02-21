import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {thunk} from "redux-thunk";
import userReducer from "../reducers/userReducer";
import loginStatusReducer from "../reducers/loginStatusReducer";
import searchTurfReducer from "../reducers/searchTurfReducer";
import locationReducer from "../reducers/locationReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// 🔹 Define Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["location"], // 🔥 Persist only location
};

// 🔹 Combine Reducers
const rootReducer = combineReducers({
  user: userReducer,
  loginStatus: loginStatusReducer,
  searchTurf: searchTurfReducer,
  location: locationReducer,
});

// 🔹 Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Create Store with Middleware
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
