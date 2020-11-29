import {
  GET_MAJOR_BY_NAME,
  GET_MAJOR_BY_ID,
  DELETE_MAJOR,
  UPDATE_MAJOR,
  ADD_MAJOR,
} from "../actions/actionTypes";

const initialState = {
  searchParams: {
    name: "",
  },
  searchResults: [],
  loading: true,
  deleteMajor: false,
  majorUpdate: false,
  majorAdd: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MAJOR_BY_NAME:
      return {
        ...state,
        searchParams: {
          name: payload.searchParams.name ? payload.searchParams.name : "",
        },
        searchResults: payload.data,
        loading: false,
      };
    case GET_MAJOR_BY_ID:
      return {
        ...state,
        searchResults: payload,
      };
    case DELETE_MAJOR:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        deleteMajor: change,
      };
    case UPDATE_MAJOR:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        majorUpdate: change2,
      };
    case ADD_MAJOR:
      let change3 = false;
      if (payload === "success") {
        change3 = true;
      }
      return {
        ...state,
        majorAdd: change3,
      };
    default:
      return state;
  }
};
