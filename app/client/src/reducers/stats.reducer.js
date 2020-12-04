import {
  GET_MAJOR_STATS,
  GET_WORKPLACE_STATS,
  GET_GENDER_STATS,
  GET_EXPERIENCE_STATS,
  GET_JOB_TYPE_STATS,
  GET_SALARY_STATS,
} from "../actions/actionTypes";

const initialState = {
  major: {},
  workPlace: {},
  gender: {},
  experience: {},
  jobType: {},
  salary: {},
};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MAJOR_STATS:
      return {
        ...state,
        major: payload,
      };
    case GET_WORKPLACE_STATS:
      return {
        ...state,
        workPlace: payload,
      };
    case GET_GENDER_STATS:
      return {
        ...state,
        gender: payload,
      };
    case GET_EXPERIENCE_STATS:
      return {
        ...state,
        experience: payload,
      };
    case GET_JOB_TYPE_STATS:
      return {
        ...state,
        jobType: payload,
      };
    case GET_SALARY_STATS:
      return {
        ...state,
        salary: payload,
      };
    default:
      return state;
  }
};
