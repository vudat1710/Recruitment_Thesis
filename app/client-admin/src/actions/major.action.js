import {
  GET_MAJOR_BY_NAME,
  GET_MAJOR_BY_ID,
  DELETE_MAJOR,
  ADD_MAJOR,
  UPDATE_MAJOR,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getMajorByName = (params) => async (dispatch) => {
  const res = await axios.post(`/api/major/getMajorByName`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_MAJOR_BY_NAME,
      payload: { searchParams: params, data: res.data },
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getMajorById = (params) => async (dispatch) => {
  const res = await axios.post(`/api/major/getMajorById`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_MAJOR_BY_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const deleteMajor = (params) => async (dispatch) => {
  const res = await axios.post(`/api/major/deleteMajor`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: DELETE_MAJOR,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const updateMajor = (params) => async (dispatch) => {
  const res = await axios.post(`/api/major/updateMajor`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: UPDATE_MAJOR,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const addMajor = (params) => async (dispatch) => {
  const res = await axios.post(`/api/major/addMajor`, params);

  if (res.data.status !== 400) {
    dispatch({
      type: ADD_MAJOR,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};
