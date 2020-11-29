import {
  GET_WORKPLACE_BY_NAME,
  GET_WORKPLACE_BY_ID,
  DELETE_WORKPLACE,
  ADD_WORKPLACE,
  UPDATE_WORKPLACE,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getWorkPlaceByName = (params) => async (dispatch) => {
  const res = await axios.post(`/api/workplace/getWorkPlaceByName`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_WORKPLACE_BY_NAME,
      payload: { searchParams: params, data: res.data },
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getWorkPlaceById = (params) => async (dispatch) => {
  const res = await axios.post(`/api/workplace/getWorkPlaceById`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_WORKPLACE_BY_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const deleteWorkPlace = (params) => async (dispatch) => {
  const res = await axios.post(`/api/workplace/deleteWorkPlace`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: DELETE_WORKPLACE,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const updateWorkPlace = (params) => async (dispatch) => {
  const res = await axios.post(`/api/workplace/updateWorkPlace`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: UPDATE_WORKPLACE,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const addWorkPlace = (params) => async (dispatch) => {
  const res = await axios.post(`/api/workplace/addWorkPlace`, params);

  if (res.data.status !== 400) {
    dispatch({
      type: ADD_WORKPLACE,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};
