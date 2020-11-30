import axios from "axios";
import {
  SEARCH_USERS,
  LOCK_ACCOUNT,
  UNLOCK_ACCOUNT,
  GET_ERRORS,
  GET_USER_BY_USER_ID,
  CHANGE_STATE
} from "./actionTypes";

export const getUserByUserId = (params) => async (dispatch) => {
  const res = await axios.post(`/api/user/findUserById`, params);

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

export const searchUsers = (searchParams) => async (dispatch) => {
  const res = await axios.post(`/api/user/searchUsers`, searchParams);
  dispatch({
    type: SEARCH_USERS,
    payload: { searchParams: searchParams, data: res.data },
  });
};

export const lockAccount = (params) => async (dispatch) => {
  const res = await axios.post(`/api/user/lockAccount`, params);
  
  console.log(res.data)
  if (res.data.status !== 400) {
    dispatch({
      type: LOCK_ACCOUNT,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
}

export const unlockAccount = (params) => async (dispatch) => {
  const res = await axios.post(`/api/user/unlockAccount`, params);
  
  if (res.data.status !== 400) {
    dispatch({
      type: UNLOCK_ACCOUNT,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
}

export const changeState = (params) => async (dispatch) => {
  if (params.type === "lock") {
    dispatch({
      type: LOCK_ACCOUNT,
      payload: ""
    })
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
  } else if (params.type === "unlock") {
    dispatch({
      type: UNLOCK_ACCOUNT,
      payload: ""
    })
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
  }
}
