import { GET_RELATED_ITEMS, GET_USER_RECOMMEND } from "../actions/actionTypes";

const initialState = {
  userRecommend: [],
  items: [],
};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_RECOMMEND:
      return {
        ...state,
        userRecommend: payload,
      };
    case GET_RELATED_ITEMS:
      console.log(payload)
      return {
        ...state,
        items: payload,
      };
    default:
      return state;
  }
};
