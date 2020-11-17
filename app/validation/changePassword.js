/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  const errors = {};

  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : '';
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
  data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : '';

  if (Validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = 'Mật khẩu cũ không được bỏ trống';
  }

  if (Validator.isEmpty(data.newPassword)) {
    errors.newPassword = 'Mật khẩu mới không được bỏ trống';
  }

  if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = 'Mật khẩu mới phải chứa ít nhất 6 ký tự';
  }

  if (Validator.isEmpty(data.newPassword2)) {
    errors.newPassword2 = 'Xác nhận mật khẩu mới không được bỏ trống';
  }

  if (!Validator.equals(data.newPassword, data.newPassword2)) {
    errors.newPassword2 = 'Mật khẩu mới chưa khớp';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};