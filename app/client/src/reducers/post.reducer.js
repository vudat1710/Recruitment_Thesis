import {
  GET_POSTS,
  GET_DATA_AUTOCOMPLETE,
  SEARCH_POSTS,
  GET_POST_BY_ID,
  POST_COMMENT,
  RATE_POST,
  GET_RATE_BY_USER_ID_POST_ID,
  GET_COMMENT_BY_POST_ID,
  GET_POST_BY_COMPANY_ID,
  DELETE_COMMENT,
  COMPARE,
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
  postCommentSuccess: false,
  postRateSuccess: false,
  rate: 0,
  comments: [],
  deleteCommentSuccess: false,
  compare: {}
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
    case GET_POST_BY_COMPANY_ID:
      return {
        ...state,
        searchResults: payload,
        loading: false
      }
    case GET_POST_BY_ID:
      return {
        ...state,
        postDetails: payload,
      };
    case POST_COMMENT:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        postCommentSuccess: change,
      };
    case RATE_POST:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        postRateSuccess: change2,
      };
    case GET_RATE_BY_USER_ID_POST_ID:
      return {
        ...state,
        rate: payload,
      };
    case DELETE_COMMENT:
      let change3 = false;
      if (payload === "success") {
        change3 = true;
      }
      return {
        ...state,
        deleteCommentSuccess: change3,
      };
    case GET_COMMENT_BY_POST_ID:
      return {
        ...state,
        comments: payload
      }
    case COMPARE:
      return {
        ...state,
        compare: payload
      }
    default:
      return state;
  }
};
