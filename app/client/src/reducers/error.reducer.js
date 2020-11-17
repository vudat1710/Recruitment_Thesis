import { GET_ERRORS } from '../actions/actionTypes';

const initialState = {};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ERRORS:
      // return { ...state, ...payload }; //Lỗi vì những lỗi cũ đã mất nhưng do kế thừa state nên lỗi vẫn k tự mất đi đc
      return { ...payload };

    default:
      return state;
  }
};
