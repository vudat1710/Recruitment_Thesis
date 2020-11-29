/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Không được bỏ trống';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};