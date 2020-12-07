/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  const errors = {};

  data.majors = data.majors.length !== 0 ? data.majors.join(", ") : '';
  data.workplaces = data.workplaces.length !== 0 ? data.workplaces.join(", ") : '';


  if (Validator.isEmpty(data.majors)) {
    errors.majors = 'Ngành nghề không được bỏ trống';
  }

  if (Validator.isEmpty(data.workplaces)) {
    errors.workplaces = 'Địa điểm làm việc không được bỏ trống';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};