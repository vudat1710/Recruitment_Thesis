import { combineReducers } from 'redux';
import postReducer from './post.reducer';
import errorReducer from './error.reducer';
import companyReducer from './company.reducer';
import workPlaceReducer from './workplace.reducer';
import majorReducer from './major.reducer';
import userReducer from './user.reducer';
import commentReducer from './comment.reducer';

export default combineReducers({
  posts: postReducer,
  company: companyReducer,
  errors: errorReducer,
  workPlace: workPlaceReducer,
  major: majorReducer,
  user: userReducer,
  comments: commentReducer,
});
