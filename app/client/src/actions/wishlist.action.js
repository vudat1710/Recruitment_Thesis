import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  GET_WISHLIST,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getWishList = (params) => async (dispatch) => {
  const res = await axios.post(`/api/other/getWishList`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_WISHLIST,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const addToWishList = (params) => async (dispatch) => {
  const res = await axios.post(`/api/other/addToWishList`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: ADD_TO_WISHLIST,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const removeFromWishList = (params) => async (dispatch) => {
  const res = await axios.post(`/api/other/removeFromWishList`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: REMOVE_FROM_WISHLIST,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};
