import axios from "axios";
import {
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_USER_BY_USER_ID,
  UPDATE_USER,
  GET_CLICK_POST_EVENT
} from "./actionTypes";

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

export const getUserByUserId = (attributes) => async (dispatch) => {
  const userId = localStorage.userId;
  const res = await axios.post(`/api/user/findUserById`, {
    userId,
    attributes,
  });

  if (res.data.status !== 400) {
    dispatch({
      type: GET_USER_BY_USER_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const updateUser = (params) => async (dispatch) => {
  const res = await axios.post(`/api/user/updateUser`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: UPDATE_USER,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
}

export const getClickPostEvent = (params) => async (dispatch) => {
  const res = await axios.post(`/api/action/getClick`, params);

  if (res.data.status !== 400) {
    dispatch({
      type: GET_CLICK_POST_EVENT,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
}
