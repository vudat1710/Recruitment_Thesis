import {
  GET_WORKPLACE_BY_NAME,
  GET_WORKPLACE_BY_ID,
  DELETE_WORKPLACE,
  UPDATE_WORKPLACE,
  ADD_WORKPLACE,
} from "../actions/actionTypes";

const initialState = {
  searchParams: {
    name: "",
  },
  searchResults: [],
  loading: true,
  deleteWorkPlace: false,
  workPlaceUpdate: false,
  workPlaceAdd: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_WORKPLACE_BY_NAME:
      return {
        ...state,
        searchParams: {
          name: payload.searchParams.name ? payload.searchParams.name : "",
        },
        searchResults: payload.data,
        loading: false,
      };
    case GET_WORKPLACE_BY_ID:
      return {
        ...state,
        searchResults: payload
      };
    case DELETE_WORKPLACE:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        deleteWorkPlace: change,
      };
    case UPDATE_WORKPLACE:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        workPlaceUpdate: change2,
      };
    case ADD_WORKPLACE:
      let change3 = false;
      if (payload === "success") {
        change3 = true;
      }
      return {
        ...state,
        workPlaceAdd: change3,
      };
    default:
      return state;
  }
};
