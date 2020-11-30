import { SEARCH_COMMENTS, DELETE_COMMENT } from "../actions/actionTypes";

const initialState = {
  error: "",
  loading: false,
  searchParams: {
    content: "",
  },
  searchResults: [],
  commentDelete: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SEARCH_COMMENTS:
      return {
        ...state,
        searchParams: {
          content: payload.searchParams.content
            ? payload.searchParams.content
            : "",
        },
        searchResults: payload.data,
        loading: false,
      };
    case DELETE_COMMENT:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        commentDelete: change,
      };
    default:
      return state;
  }
};
