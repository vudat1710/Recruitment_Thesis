import {
  GET_ACTION_TYPE_BY_NAME,
  GET_ACTION_TYPE_BY_ID,
  DELETE_ACTION_TYPE,
  ADD_ACTION_TYPE,
  UPDATE_ACTION_TYPE,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getActionTypeByName = (params) => async (dispatch) => {
  const res = await axios.post(`/api/action/getActionTypeByName`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_ACTION_TYPE_BY_NAME,
      payload: { searchParams: params, data: res.data },
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getActionTypeById = (params) => async (dispatch) => {
  const res = await axios.post(`/api/action/getActionTypeById`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_ACTION_TYPE_BY_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const deleteActionType = (params) => async (dispatch) => {
  const res = await axios.post(`/api/action/deleteActionType`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: DELETE_ACTION_TYPE,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const updateActionType = (params) => async (dispatch) => {
  const res = await axios.post(`/api/action/updateActionType`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: UPDATE_ACTION_TYPE,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const addActionType = (params) => async (dispatch) => {
  const res = await axios.post(`/api/action/addActionType`, params);

  if (res.data.status !== 400) {
    dispatch({
      type: ADD_ACTION_TYPE,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};
