import {
  GET_MAJOR_STATS,
  GET_GENDER_STATS,
  GET_JOB_TYPE_STATS,
  GET_SALARY_STATS,
  GET_EXPERIENCE_STATS,
  GET_WORKPLACE_STATS,
  GET_ERRORS,
} from "./actionTypes";
import axios from "axios";

export const getMajorStats = () => async (dispatch) => {
  const res = await axios.get(`/api/stats/getMajorStats`);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_MAJOR_STATS,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getWorkPlaceStats = () => async (dispatch) => {
  const res = await axios.get(`/api/stats/getWorkPlaceStats`);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_WORKPLACE_STATS,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getSalaryStats = () => async (dispatch) => {
  const res = await axios.get(`/api/stats/getSalaryStats`);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_SALARY_STATS,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getGenderStats = () => async (dispatch) => {
  const res = await axios.get(`/api/stats/getGenderStats`);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_GENDER_STATS,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getJobTypeStats = () => async (dispatch) => {
  const res = await axios.get(`/api/stats/getJobTypeStats`);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_JOB_TYPE_STATS,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};

export const getExperienceStats = () => async (dispatch) => {
  const res = await axios.get(`/api/stats/getExperienceStats`);
  if (res.data.status !== 400) {
    dispatch({
      type: GET_EXPERIENCE_STATS,
      payload: res.data,
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data.errors,
    });
  }
};
