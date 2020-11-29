import {
  GET_COMPANY_BY_ID,
  SEARCH_COMPANIES,
  DELETE_COMPANY,
  UPDATE_COMPANY,
  ADD_COMPANY,
} from "../actions/actionTypes";

const initialState = {
  companyDetails: {},
  searchParams: {
    name: "",
  },
  searchResults: [],
  loading: true,
  deleteCompany: false,
  companyUpdate: false,
  companyAdd: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_COMPANY_BY_ID:
      return {
        ...state,
        companyDetails: payload,
        loading: false,
      };
    case SEARCH_COMPANIES:
      return {
        ...state,
        searchParams: {
          name: payload.searchParams.name ? payload.searchParams.name : "",
        },
        searchResults: payload.data,
        loading: false,
      };
    case DELETE_COMPANY:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        deleteCompany: change,
      };
    case UPDATE_COMPANY:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        companyUpdate: change2,
      };
    case ADD_COMPANY:
      let change3 = false;
      if (payload === "success") {
        change3 = true;
      }
      return {
        ...state,
        companyAdd: change3,
      };
    default:
      return state;
  }
};
