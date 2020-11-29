/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.address = !isEmpty(data.address) ? data.address : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Công ty không được bỏ trống';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Địa chỉ không được bỏ trống';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};