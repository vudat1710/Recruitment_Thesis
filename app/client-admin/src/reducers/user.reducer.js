import {
  GET_USER_BY_USER_ID,
  LOCK_ACCOUNT,
  UNLOCK_ACCOUNT,
  SEARCH_USERS,
} from "../actions/actionTypes";

const initialState = {
  userDetails: {},
  searchParams: {
    user_name: "",
  },
  searchResults: [],
  lockAccount: false,
  unlockAccount: false,
};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_BY_USER_ID:
      return {
        ...state,
        userDetails: payload,
      };
    case SEARCH_USERS:
      return {
        ...state,
        searchParams: {
          user_name: payload.searchParams.user_name
            ? payload.searchParams.user_name
            : "",
        },
        searchResults: payload.data,
      };
    case LOCK_ACCOUNT:
      let change = false;
      if (payload === "success") {
        change = true;
      }
      return {
        ...state,
        lockAccount: change,
      };
    case UNLOCK_ACCOUNT:
      let change2 = false;
      if (payload === "success") {
        change2 = true;
      }
      return {
        ...state,
        unlockAccount: change2,
      };

    default:
      return state;
  }
};
