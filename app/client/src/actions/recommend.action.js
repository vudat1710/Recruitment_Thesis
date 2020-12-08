import { GET_USER_RECOMMEND, GET_RELATED_ITEMS } from "./actionTypes";
import axios from "axios";

const utf8 = require('utf8');

export const getUserRecommend = (params) => async (dispatch) => {
  let res = await axios.post(`/api2/recommender/getUserRecommend`, params);
  dispatch({
    type: GET_USER_RECOMMEND,
    payload: res.data.data,
  });
};

export const getRelatedItems = (params) => async (dispatch) => {
  let res = await axios.post(`/api2/recommender/getRelatedItems`, params);
  dispatch({
    type: GET_RELATED_ITEMS,
    payload: res.data.data,
  });
};
