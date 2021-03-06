import { combineReducers } from 'redux';
import postReducer from './post.reducer';
import authReducer from './auth.reducer';
import errorReducer from './error.reducer';
import wishListReducer from './wishlist.reducer';
import companyReducer from './company.reducer';
import userReducer from './user.reducer';
import statsReducer from './stats.reducer';
import recommendReducer from './recommend.reducer';

export default combineReducers({
  posts: postReducer,
  auth: authReducer,
  wishlist: wishListReducer,
  company: companyReducer,
  errors: errorReducer,
  user: userReducer,
  stats: statsReducer,
  recommend: recommendReducer
});
