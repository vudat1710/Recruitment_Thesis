import {
  GET_COMPANY_BY_ID,
  GET_POST_BY_COMPANY_ID,
  SEARCH_COMPANIES,
  DELETE_COMPANY,
  ADD_COMPANY,
  UPDATE_COMPANY,
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

export const searchCompanies = (searchParams) => async (dispatch) => {
  const res = await axios.post(`/api/company/searchCompanies`, searchParams);
  dispatch({
    type: SEARCH_COMPANIES,
    payload: { searchParams: searchParams, data: res.data },
  });
};

export const deleteCompany = (params) => async (dispatch) => {
  const res = await axios.post(`/api/company/deleteCompany`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: DELETE_COMPANY,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const updateCompany = (params) => async (dispatch) => {
  const res = await axios.post(`/api/company/updateCompany`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: UPDATE_COMPANY,
      payload: "success",
    });
  } else {
    console.log(res.data)
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
}

export const addCompany = (params) => async (dispatch) => {
  const res = await axios.post(`/api/company/addCompany`, params);

  if (res.data.status !== 400) {
    dispatch({
      type: ADD_COMPANY,
      payload: "success",
    });
  } else {
    console.log(res.data.errors)
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};