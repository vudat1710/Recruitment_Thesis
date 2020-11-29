import {
  GET_DATA_AUTOCOMPLETE,
  SEARCH_POSTS,
  GET_POST_BY_ID,
  DELETE_POST,
  UPDATE_POST,
  ADD_POST,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

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
  if (res.data.status !== 400) {
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

export const deletePost = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/deletePostAdmin`, params);
  if (res.data.status !== 400) {
    dispatch({
      type: DELETE_POST,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.message,
    });
  }
};

export const updatePost = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/updatePostAdmin`, params);
  
  if (res.data.status !== 400) {
    dispatch({
      type: UPDATE_POST,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
}

export const addPost = (params) => async (dispatch) => {
  const res = await axios.post(`/api/post/addPostAdmin`, params);

  if (res.data.status !== 400) {
    dispatch({
      type: ADD_POST,
      payload: "success",
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};
