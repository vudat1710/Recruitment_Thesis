/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = data => {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.majors = data.majors.length !== 0 ? data.majors.join(", ") : '';
  data.workplaces = data.workplaces.length !== 0 ? data.workplaces.join(", ") : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.job_benefits = !isEmpty(data.job_benefits) ? data.job_benefits : '';
  data.extra_requirements = !isEmpty(data.extra_requirements) ? data.extra_requirements : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Tiêu đề không được bỏ trống';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Công ty không được bỏ trống';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Địa chỉ không được bỏ trống';
  }

  if (Validator.isEmpty(data.majors)) {
    errors.majors = 'Ngành nghề không được bỏ trống';
  }

  if (Validator.isEmpty(data.workplaces)) {
    errors.workplaces = 'Địa điểm làm việc không được bỏ trống';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Địa điểm làm việc không được bỏ trống';
  }

  if (Validator.isEmpty(data.job_benefits)) {
    errors.job_benefits = 'Quyền lợi làm việc không được bỏ trống';
  }

  if (Validator.isEmpty(data.extra_requirements)) {
    errors.extra_requirements = 'Yêu cầu bổ sung không được bỏ trống';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};