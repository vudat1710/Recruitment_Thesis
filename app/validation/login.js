/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = data => {
  const errors = {};
  data.user_name = !isEmpty(data.user_name) ? data.user_name : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.user_name)) {
    errors.login = 'Vui lòng nhập tên tài khoản đã đăng ký';
  }

  if (Validator.isEmpty(data.password)) {
    errors.login = 'Vui lòng nhập mật khẩu';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};