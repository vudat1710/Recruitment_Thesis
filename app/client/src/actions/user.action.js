import axios from "axios";
import {
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_USER_BY_USER_ID,
  UPDATE_USER
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

  if (res.status !== 400) {
    dispatch({
      type: GET_USER_BY_USER_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const updateUser = (params) => async (dispatch) => {
  const res = await axios.post(`/api/user/updateUser`, params);
  if (res.status !== 400) {
    dispatch({
      type: UPDATE_USER,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
}
