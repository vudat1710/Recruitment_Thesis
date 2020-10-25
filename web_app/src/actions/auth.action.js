import axios from 'axios';
import setAuthToken from '../utils/setAuthTokens';
import { GET_ERRORS, SET_CURRENT_USER, FORGET_PASSWORD, CHANGE_PASSWORD } from './actionTypes';
import { clearCurrentProfile } from './user.action';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('api/here', userData)
    .then(res => {
      if (res.data.status === 400){
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      }
      else history.push('/login')
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.data,
      });
    });
};

export const loginUser = userData => dispatch => {
  axios
    .post('api/here', userData)
    .then(res => {
      // save to LocalStorage
      if (res.data.status !== 400) {
        const token = res.data.id;
        const user_id = res.data.userId;

        //set token to ls
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', user_id);
        localStorage.setItem('ttl', res.data.ttl);
        // set token to Auth header
        setAuthToken(token);
        //Set Current user
        dispatch(setCurrentUser(token));
      } else {
        return dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      }
    })
    .catch(err => {
      return dispatch({
        type: GET_ERRORS,
        payload: err.data,
      });
    });
};

export const setCurrentUser = token => {
  return {
    type: SET_CURRENT_USER,
    payload: token,
  };
};

export const forgetPassword = (email) => dispatch => {
  axios.post(`customer/forgotPass`, {email: email})
  .then(res => {
    if (res.data.status === 400){
      dispatch({
        type: GET_ERRORS,
        payload: res.data
      })
    } else{
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
      dispatch({
        type: FORGET_PASSWORD,
        payload: 'success'
      })
    }
  })
}

export const changePassword = (password1, password2, passwordOld) => async dispatch => {
  const userId = localStorage.userId
  const res = await axios.post(`customer/resetPass`, {userId: userId, pass1: password1, pass2: password2, passOld: passwordOld})
  if (res.status === 204){
    dispatch({
      type: CHANGE_PASSWORD,
      payload: 'success'
    })
    dispatch({
      type: GET_ERRORS,
      payload: {}
    })
  } else{
    dispatch({
      type: CHANGE_PASSWORD,
      payload: 'failed'
    })
    dispatch({
      type: GET_ERRORS,
      payload: res.data
    }) 
  }
  // })
}

// Log user out
export const logoutUser = () => dispatch => {
  axios
  .post('customer/logout')
  .then( res => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userId')
  localStorage.removeItem('ttl')
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  //Remove user profile
  dispatch(clearCurrentProfile());
  })
};
