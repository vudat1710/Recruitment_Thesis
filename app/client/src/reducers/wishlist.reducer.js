import {
  GET_WISHLIST,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  SEARCH_POSTS_BY_TITLE
} from "../actions/actionTypes";

const initialState = {
  posts: [],
  searchParams: {
    title: ""
  },
  searchResults: [],
  loading: true,
  addSuccess: false,
  removeSuccess: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_WISHLIST:
      return {
        ...state,
        posts: payload.posts,
        loading: false,
      };
    case SEARCH_POSTS_BY_TITLE:
      console.log(payload)
      return {
        ...state,
        searchParams: {
          title: payload.searchParams.title ? payload.searchParams.title : ""
        },
        searchResults: payload.data
      }
    case ADD_TO_WISHLIST:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        addSuccess: change,
      };
    case REMOVE_FROM_WISHLIST:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        removeSuccess: change2,
      };
    default:
      return state;
  }
};
