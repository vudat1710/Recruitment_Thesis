import {
  GET_WISHLIST,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "../actions/actionTypes";

const initialState = {
  posts: [],
  totalItems: 0,
  currentPage: 0,
  totalPages: 0,
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
        totalItems: payload.totalItems,
        currentPage: payload.currentPage,
        totalPages: payload.totalPages,
        loading: false,
      };
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
