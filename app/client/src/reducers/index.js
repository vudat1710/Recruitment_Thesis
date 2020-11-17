import { combineReducers } from 'redux';
import postReducer from './post.reducer';
import authReducer from './auth.reducer';
import errorReducer from './error.reducer';

export default combineReducers({
  posts: postReducer,
  auth: authReducer,
  errors: errorReducer,
});
