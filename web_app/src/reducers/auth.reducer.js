import { SET_CURRENT_USER, FORGET_PASSWORD, CHANGE_PASSWORD } from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  user: {},
  forgetSuccess: false,
  changeSuccess: false,
};

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(payload),
        user: payload
      };
    case FORGET_PASSWORD:
      return {
        ...state,
        forgetSuccess: true
      }
    case CHANGE_PASSWORD:
      if (payload === "success"){
        return {
          ...state,
          changeSuccess: true
        }
      } else if (payload === "failed") {
        return {
          ...state,
          changeSuccess: false
        }
      }
    default:
      return state;
  }
};
