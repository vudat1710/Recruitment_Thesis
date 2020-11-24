import {
  GET_POSTS,
  GET_DATA_AUTOCOMPLETE,
  SEARCH_POSTS,
  POST_COMMENT,
  RATE_POST,
  GET_POST_BY_ID,
  GET_RATE_BY_USER_ID_POST_ID,
  DELETE_COMMENT,
  GET_COMMENT_BY_POST_ID,
  COMPARE,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getPosts = (params) => async (dispatch) => {
  let res = await axios.post(`/api/post/findPosts`, params);
  dispatch({
    type: GET_POSTS,
    payload: {
      results: {
        response: res.data,
        type: params.type,
        numPosts: res.data.length,
      },
      params: params,
    },
  });
};

export const getDataAutoComplete = () => async (dispatch) => {
  let res = await axios.get(`/api/other/getDataAutoComplete`);
  dispatch({
    type: GET_DATA_AUTOCOMPLETE,
    payload: {
      positions: res.data.positions,
      workplaces: res.data.workplaces,
      majors: res.data.majors,
      salary_types: res.data.salary_types,
      jobTypes: res.data.job_types,
      experience: res.data.experience,
      numPosts: res.data.num_posts,
      qualifications: res.data.qualifications,
    },
  });
};

export const searchPosts = (searchParams) => async (dispatch) => {
  const res = await axios.post(`/api/post/searchPosts`, searchParams);
  dispatch({
    type: SEARCH_POSTS,
    payload: { searchParams: searchParams, data: res.data },
  });
};

export const getPostById = (postId) => async (dispatch) => {
  const res = await axios.post(`/api/post/getPostById`, { postId });
  if (res.status !== 400) {
    dispatch({
      type: GET_POST_BY_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const postComment = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/comment`, params);
  if (res.status !== 400) {
    dispatch({
      type: POST_COMMENT,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const ratePost = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/rate`, params);
  if (res.status !== 400) {
    dispatch({
      type: RATE_POST,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const getRateByUserIdPostId = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/getRateByUserIdPostId`, params);
  if (res.status !== 400) {
    dispatch({
      type: GET_RATE_BY_USER_ID_POST_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const deleteComment = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/deleteComment`, params);
  if (res.status !== 400) {
    dispatch({
      type: DELETE_COMMENT,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const getCommentByPostId = (postId) => async (dispatch) => {
  const res = await axios.post(`/api/post/getCommentByPostId`, { postId });
  if (res.status !== 400) {
    dispatch({
      type: GET_COMMENT_BY_POST_ID,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const compare = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/compare`, params);
  if (res.status !== 400) {
    dispatch({
      type: COMPARE,
      payload: res.data.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};