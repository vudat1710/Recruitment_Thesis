import {
  GET_DATA_AUTOCOMPLETE,
  SEARCH_POSTS,
  GET_POST_BY_ID,
  GET_POST_BY_COMPANY_ID,
  DELETE_POST,
  UPDATE_POST,
  ADD_POST,
} from "../actions/actionTypes";

const initialState = {
  error: "",
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
  postDelete: false,
  postUpdate: false,
  postAdd: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
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
    case GET_POST_BY_COMPANY_ID:
      return {
        ...state,
        searchResults: payload,
        loading: false,
      };
    case GET_POST_BY_ID:
      return {
        ...state,
        postDetails: payload,
      };
    case DELETE_POST:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        postDelete: change,
      };
    case UPDATE_POST:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        postUpdate: change2,
      };
    case ADD_POST:
      let change3 = false;
      if (payload === "success") {
        change3 = true;
      }
      return {
        ...state,
        postAdd: change3,
      };
    default:
      return state;
  }
};
