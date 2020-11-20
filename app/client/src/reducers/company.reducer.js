import {
  GET_COMPANY_BY_ID,
  GET_POST_BY_COMPANY_ID,
} from "../actions/actionTypes";

const initialState = {
  companyDetails: {},
  loading: true,
  posts: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_COMPANY_BY_ID:
      return {
        ...state,
        companyDetails: payload,
        loading: false,
      };
    case GET_POST_BY_COMPANY_ID:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    default:
      return state;
  }
};
