import axios from "axios";
import setAuthToken from "../utils/setAuthTokens";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  FORGET_PASSWORD,
  CHANGE_PASSWORD,
  GET_USER_RECOMMEND,
} from "./actionTypes";
import { clearCurrentProfile } from "./user.action";

export const registerUser = (userData, history) => async (dispatch) => {
  const res = await axios.post(`api/user/register`, userData);

  if (res.data.status === 400) {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  } else history.push("/login");
};

export const handleUnauthorizedError = () => async (dispatch) => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  //Remove user profile
  dispatch(clearCurrentProfile());
  window.location.href = "/login";
}

export const loginUser = (userData) => async (dispatch) => {
  const res = await axios.post(`api/user/login`, userData);
  if (res.data.status !== 400) {
    const token = res.data.token;
    const userId = res.data.payload.userId;
    const user_name = res.data.payload.user_name;

    //set token to ls
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", user_name);
    // set token to Auth header
    setAuthToken(token);

    //Set Current user
    dispatch(setCurrentUser(token));
    dispatch({
      type: GET_USER_RECOMMEND,
      payload: [],
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const setCurrentUser = (token) => {
  return {
    type: SET_CURRENT_USER,
    payload: token,
  };
};

export const forgotPassword = (newData) => async (dispatch) => {
  const res = await axios.post(`api/user/forgotPassword`, newData);
  if (res.data.status === 400) {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
    dispatch({
      type: FORGET_PASSWORD,
      payload: "success",
    });
  }
};

export const changePassword = (newData) => async (dispatch) => {
  const res = await axios.post(`api/user/changePassword`, newData);
  if (res.data.status === 400) {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
    dispatch({
      type: CHANGE_PASSWORD,
      payload: "success",
    });
  }
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  //Remove user profile
  dispatch(clearCurrentProfile());
};
