import {
  GET_COMPANY_BY_ID,
  GET_POST_BY_COMPANY_ID,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getCompanyById = (companyId) => async (dispatch) => {
  const res = await axios.post(`/api/company/getCompanyById`, { companyId });
  if (res.status !== 400) {
    dispatch({
      type: GET_COMPANY_BY_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const getPostByCompanyId = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/getPostByCompanyId`, params );
  if (res.status !== 400) {
    dispatch({
      type: GET_POST_BY_COMPANY_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};
