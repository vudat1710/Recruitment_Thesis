/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  const errors = {};

  data.user_name = !isEmpty(data.user_name) ? data.user_name : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.user_name, { min: 2, max: 30 })) {
    errors.user_name = 'Tên phải chứa từ 2 đến 30 ký tự';
  }

  if (Validator.isEmpty(data.user_name)) {
    errors.user_name = 'Tên không được bỏ trống';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Mật khẩu không được bỏ trống';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Xác nhận mật khẩu không được bỏ trống';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Mật khẩu chưa khớp';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};