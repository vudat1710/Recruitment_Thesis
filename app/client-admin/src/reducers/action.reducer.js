import {
    GET_ACTION_TYPE_BY_NAME,
    GET_ACTION_TYPE_BY_ID,
    DELETE_ACTION_TYPE,
    UPDATE_ACTION_TYPE,
    ADD_ACTION_TYPE,
  } from "../actions/actionTypes";
  
  const initialState = {
    searchParams: {
      name: "",
    },
    searchResults: [],
    loading: true,
    deleteActionType: false,
    actionTypeUpdate: false,
    actionTypeAdd: false,
  };
  
  export default (state = initialState, { type, payload }) => {
    switch (type) {
      case GET_ACTION_TYPE_BY_NAME:
        return {
          ...state,
          searchParams: {
            name: payload.searchParams.name ? payload.searchParams.name : "",
          },
          searchResults: payload.data,
          loading: false,
        };
      case GET_ACTION_TYPE_BY_ID:
        return {
          ...state,
          searchResults: payload
        };
      case DELETE_ACTION_TYPE:
        let change = false;
        if (payload === "success") {
          change = true;
        }
        return {
          ...state,
          deleteActionType: change,
        };
      case UPDATE_ACTION_TYPE:
        let change2 = false;
        if (payload === "success") {
          change2 = true;
        }
        return {
          ...state,
          actionTypeUpdate: change2,
        };
      case ADD_ACTION_TYPE:
        let change3 = false;
        if (payload === "success") {
          change3 = true;
        }
        return {
          ...state,
          actionTypeAdd: change3,
        };
      default:
        return state;
    }
  };
  