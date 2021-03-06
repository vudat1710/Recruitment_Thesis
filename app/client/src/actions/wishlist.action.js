import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  GET_WISHLIST,
  SEARCH_POSTS_BY_TITLE,
  GET_ERRORS,
} from "./actionTypes";
import { handleUnauthorizedError } from "./auth.action";
import axios from "axios";

export const getWishList = (params) => async (dispatch) => {
  await axios
    .post(`/api/other/getWishList`, params)
    .then(function (res) {
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
    })
    .catch(function (err) {
      if (err.response.status === 401) {
        dispatch(handleUnauthorizedError());
      }
    });
};

export const searchPostsByTitle = (params) => async (dispatch) => {
  await axios
    .post(`/api/other/searchPostsByTitle`, params)
    .then(function (res) {
      if (res.data.status !== 400) {
        dispatch({
          type: SEARCH_POSTS_BY_TITLE,
          payload: { searchParams: params, data: res.data },
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: res.message,
        });
      }
    })
    .catch(function (err) {
      if (err.response.status === 401) {
        dispatch(handleUnauthorizedError());
      }
    });
};

export const addToWishList = (params) => async (dispatch) => {
  await axios
    .post(`/api/other/addToWishList`, params)
    .then(function (res) {
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
    })
    .catch(function (err) {
      if (err.response.status === 401) {
        dispatch(handleUnauthorizedError());
      }
    });
};

export const removeFromWishList = (params) => async (dispatch) => {
  const res = await axios.post(`/api/other/removeFromWishList`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: REMOVE_FROM_WISHLIST,
      payload: "success",
    });
  } else if (res.data.status === 401) {
    handleUnauthorizedError();
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};
