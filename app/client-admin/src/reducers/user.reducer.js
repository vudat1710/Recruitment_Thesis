import { GET_USER_BY_USER_ID, UPDATE_USER } from "../actions/actionTypes";

const initialState = {
  user: {},
  success: false
};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_BY_USER_ID:
      return { 
          ...state,
          user: payload
        };
    case UPDATE_USER:
      if (payload === "success") {
        return {
          ...state,
          success: true,
        }
      }

    default:
      return state;
  }
};
