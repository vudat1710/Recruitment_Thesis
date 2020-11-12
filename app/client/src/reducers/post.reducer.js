import { GET_POSTS, GET_DATA_AUTOCOMPLETE, SEARCH_POSTS } from '../actions/actionTypes';

const initialState = {
    error: '',
    postData: [],
    params: {},
    getType: "latest",
    autoComplete: null,
    loading: false
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                postData: payload.results.response,
                params: payload.params,
                getType: payload.results.getType,
                loading: false
            };
        case GET_DATA_AUTOCOMPLETE:
            return {
                ...state,
                autoComplete: payload,
                loading: false
            }
        case SEARCH_POSTS:
            return {
                ...state,
                postData: payload,
                loading: false
            }
        default:
            return state;
    }
}