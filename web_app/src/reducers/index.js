import { combineReducers } from 'redux';
import postReducer from './post.reducer';
import authReducer from './auth.reducer';

export default combineReducers({
  posts: postReducer,
  auth: authReducer
});
