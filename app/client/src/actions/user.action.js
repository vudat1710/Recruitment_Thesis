import axios from 'axios';
import { CLEAR_CURRENT_PROFILE } from './actionTypes';

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};


