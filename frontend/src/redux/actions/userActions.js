export const SET_USER_INFO = "SET_USER_INFO";
export const LOGIN_STATUS = "LOGIN_STATUS";

export const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

export const loginStatus = (status) => ({
  type: "LOGIN_STATUS",
  payload: status,
});
