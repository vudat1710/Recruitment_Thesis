import {
  GET_COMPANY_BY_ID,
} from "../actions/actionTypes";

const initialState = {
  companyDetails: {},
  loading: true,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_COMPANY_BY_ID:
      return {
        ...state,
        companyDetails: payload,
        loading: false,
      };
    default:
      return state;
  }
};
