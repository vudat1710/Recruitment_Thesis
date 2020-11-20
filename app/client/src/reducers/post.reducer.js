import {
  GET_POSTS,
  GET_DATA_AUTOCOMPLETE,
  SEARCH_POSTS,
  GET_POST_BY_ID,
} from "../actions/actionTypes";

const initialState = {
  error: "",
  postData: [],
  params: {},
  getType: "latest",
  autoComplete: null,
  loading: false,
  searchParams: {
    position: [],
    workplace: [],
    major: [],
    salary_type: "",
    job_type: [],
    experience: [],
  },
  searchResults: [],
  postDetails: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        postData: payload.results.response,
        params: payload.params,
        getType: payload.results.getType,
        loading: false,
      };
    case GET_DATA_AUTOCOMPLETE:
      return {
        ...state,
        autoComplete: payload,
        loading: false,
      };
    case SEARCH_POSTS:
      return {
        ...state,
        searchParams: {
          position: payload.searchParams.position
            ? payload.searchParams.position
            : [],
          workplace: payload.searchParams.workplace
            ? payload.searchParams.workplace
            : [],
          major: payload.searchParams.major ? payload.searchParams.major : [],
          job_type: payload.searchParams.job_type
            ? payload.searchParams.job_type
            : [],
          experience: payload.searchParams.experience
            ? payload.searchParams.experience
            : [],
          salary_type: payload.searchParams.salary_type
            ? payload.searchParams.salary_type
            : "",
        },
        searchResults: payload.data,
        loading: false,
      };
    case GET_POST_BY_ID:
      return {
        ...state,
        postDetails: payload,
      };
    default:
      return state;
  }
};
