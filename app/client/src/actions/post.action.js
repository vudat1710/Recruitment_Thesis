import { GET_POSTS, GET_DATA_AUTOCOMPLETE, SEARCH_POSTS, GET_POST_BY_ID, GET_ERRORS } from "./actionTypes";
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
  const res = await axios.post(`/api/post/getPostById`, {postId});
  console.log(res.data)
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
}
