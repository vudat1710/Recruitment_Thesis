const { WorkPlacePost } = require("../models");
const db = require("../models");
const MajorPost = require("../models/MajorPost");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateChangePassword = require("../validation/changePassword");
const validateForgotPassword = require("../validation/forgotPassword");
const validateUpdateUser = require("../validation/updateUser");
const User = db.User;
const secretOrKey = "vudat1710";
const WorkPlace = db.WorkPlace;
const Major = db.Major;
const MajorItem = db.MajorItem;
const WorkPlaceUser = db.WorkPlaceUser;
const Op = db.Sequelize.Op;

function convertToObject(array, externalKey, externalValue, key) {
  let res = [];
  for (const item in array) {
    let newItem = {};
    newItem[key] = parseInt(array[item]);
    newItem[externalKey] = externalValue;
    res.push(newItem);
  }

  return res;
}

exports.register = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }

  User.findOne({ where: { user_name: req.body.user_name } }).then((user) => {
    if (user) {
      errors.user_name = "Username already exists";
      return res.status(400).json(errors);
    }

    const genderDict = { nam: "Nam", nữ: "Nữ" };

    const newUser = {
      user_name: req.body.user_name,
      password: req.body.password,
      gender: genderDict[req.body.gender.toLowerCase()],
      year_of_birth: req.body.year_of_birth,
      is_lock: false,
    };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err3, hash) => {
        if (err3) next(err3);
        newUser.password = hash;
        User.create(newUser)
          .then((data) => {
            res.json({ status: 200, success: true });
          }) // fix trả về user
          .catch((err) => {
            console.log(err.message);
            res.status(500).send({
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          });
      });
    });
  });
};

exports.login = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.json({ status: 400, errors: errors });
  }
  const { user_name, password } = req.body;
  User.findOne({ where: { user_name: user_name } }).then((user) => {
    if (!user) {
      errors.login = "Tài khoản hoặc mật khẩu không chính xác";
      return res.json({ status: 400, errors: errors });
    } else {
      if (user.is_lock === 1) {
        errors.user_name = "Tài khoản này đã bị khóa";
        return res.json({ status: 400, errors: errors });
      } else {
        bcrypt.compare(password, user.password, (err, matched) => {
          errors.login = "Tài khoản hoặc mật khẩu không chính xác";
          if (!matched) return res.json({ status: 400, errors: errors });
          // User matched
          const payload = {
            userId: user.userId,
            user_name: user.user_name,
          }; // Create JWT Payload
          // Sign Token
          jwt.sign(
            payload,
            secretOrKey,
            { expiresIn: 86400 },
            (err__, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`,
                payload,
              });
            }
          );
        });
      }
    }
  });
};

exports.findUserByUserName = (req, res) => {
  const { user_name, attributes } = req.body;
  let conditions = { where: { user_name: user_name }, attributes: attributes };
  conditions["include"] = [
    { model: WorkPlace, attributes: ["name"] },
    { model: Major, attributes: ["name"] },
  ];
  User.findOne(conditions, { subQuery: false })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Tài khoản không tồn tại",
      });
    });
};

exports.findUserById = (req, res) => {
  const { userId } = req.body;
  let conditions = { where: { userId: userId } };
  conditions["include"] = [
    { model: db.WorkPlace, attributes: ["name"] },
    { model: db.Major, attributes: ["name"] },
    { model: db.RatePost, attributes: ["postId", "rate"] }
  ];
  User.findOne(conditions, { subQuery: false })
    .then((user) => {
      if (user.userId) {
        res.send(user);
      } else {
        res.send({
          status: 400,
          message: err.message || "Tài khoản không tồn tại",
        });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Tài khoản không tồn tại",
      });
    });
};

exports.updateUser = (req, res) => {
  const { errors, isValid } = validateUpdateUser(req.body);
  if (!isValid) {
    return res.json({ status: 400, errors: errors });
  }
  let { majors, workplaces, user_name } = req.body;
  majors = majors.split(",").map(a => a.trim());
  workplaces = workplaces.split(",").map(a => a.trim());
  User.findOne({
    where: { user_name: user_name },
    include: [
      { model: WorkPlace, attributes: ["workPlaceId"] },
      { model: Major, attributes: ["majorId"] },
    ],
  }).then((user) => {
    if (user) {
      const majorIdsExist = user.Majors.map((a) => a.majorId);
      const workPlaceIdsExist = user.WorkPlaces.map((a) => a.workPlaceId);

      const experience = req.body.experience
        ? req.body.experience
        : user.experience;
      const qualification = req.body.qualification
        ? req.body.qualification
        : user.qualification;
      const job_type = req.body.job_type ? req.body.job_type : user.job_type;
      const salary = req.body.salary ? req.body.salary : user.salary;
      const gender = req.body.gender ? req.body.gender : user.gender;
      const year_of_birth = req.body.year_of_birth
        ? req.body.year_of_birth
        : user.year_of_birth;

      const updateUser = user.update({
        experience: experience,
        qualification: qualification,
        salary: salary,
        job_type: job_type,
        gender: gender,
        year_of_birth: year_of_birth,
      });

      const majorIds = Major.findAll({
        where: {
          name: majors,
        },
        attributes: ["majorId"],
      });

      const workPlaceIds = WorkPlace.findAll({
        where: {
          name: workplaces,
        },
        attributes: ["workPlaceId"],
      });

      Promise.all([updateUser, majorIds, workPlaceIds]).then((response) => {
        const newMajorIds = response[1].map((a) => a.majorId);
        const newWorkPlaceIds = response[2].map((a) => a.workPlaceId);
        const deleteMajorIds = majorIdsExist.filter(
          (e) => !newMajorIds.includes(e)
        );
        const addMajorIds = newMajorIds.filter(
          (e) => !majorIdsExist.includes(e)
        );
        const a = MajorItem.bulkCreate(
          convertToObject(addMajorIds, "userId", user.userId, "majorId")
        );

        const b = MajorItem.destroy({
          where: {
            userId: user.userId,
            majorId: deleteMajorIds,
          },
        });

        const deleteWorkPlaceIds = workPlaceIdsExist.filter(
          (e) => !newWorkPlaceIds.includes(e)
        );
        const addWorkPlaceIds = newWorkPlaceIds.filter(
          (e) => !workPlaceIdsExist.includes(e)
        );
        
        const c = WorkPlaceUser.bulkCreate(
          convertToObject(addWorkPlaceIds, "userId", user.userId, "workPlaceId")
        );

        const d = WorkPlaceUser.destroy({
          where: {
            userId: user.userId,
            workPlaceId: deleteWorkPlaceIds,
          },
        });

        Promise.all([a, b, c, d])
          .then((response) => {
            res.json({
              success: true,
            });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          });
      });
    }
  });
};

exports.lockAccount = (req, res) => {
  const { userId } = req.body;
  let conditions = { where: { userId: userId } };
  User.findOne(conditions)
    .then((user) => {
      const is_lock = user.is_lock;
      if (is_lock === 0) {
        user.update({ is_lock: 1 });
        res.json({
          success: true,
          message: "Lock account successful",
        });
      } else {
        return res.json({
          status: 400,
          errors: { user_name: "Tài khoản đã bị khóa từ trước" },
        });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Tài khoản không tồn tại",
      });
    });
};

exports.unlockAccount = (req, res) => {
  const { userId } = req.body;
  let conditions = { where: { userId: userId } };
  User.findOne(conditions)
    .then((user) => {
      const is_lock = user.is_lock;
      if (is_lock === 1) {
        user.update({ is_lock: 0 });
        res.json({
          success: true,
          message: "Unlock account successful",
        });
      } else {
        return res.json({
          status: 400,
          errors: { user_name: "Tài khoản đã được mở khóa từ trước" },
        });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Tài khoản không tồn tại",
      });
    });
};

exports.changePassword = (req, res) => {
  const { errors, isValid } = validateChangePassword(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }

  const { newPassword, oldPassword, userId } = req.body;
  let conditions = { where: { userId: userId } };
  User.findOne(conditions).then((user) => {
    bcrypt.compare(oldPassword, user.password, (err, matched) => {
      if (matched) {
        bcrypt.compare(newPassword, user.password, (err, matched) => {
          if (matched) {
            return res.json({
              status: 400,
              errors: {
                newPassword:
                  "Mật khẩu mới trùng với mật khẩu cũ, vui lòng nhập lại",
              },
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newPassword, salt, (err3, hash) => {
                if (err3) next(err3);
                user
                  .update({ password: hash })
                  .then((data) => {
                    res.json({ success: true });
                  }) // fix trả về user
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message || "Some errors occurred.",
                    });
                  });
              });
            });
          }
        });
      } else {
        return res.json({
          status: 400,
          errors: {
            oldPassword: "Mật khẩu cũ không trùng, vui lòng nhập lại",
          },
        });
      }
    });
  });
};

exports.forgotPassword = (req, res) => {
  const { errors, isValid } = validateForgotPassword(req.body);
  if (!isValid) {
    console.log(errors);
    return res.json({
      status: 400,
      errors,
    });
  }

  const { newPassword, user_name } = req.body;
  let conditions = { where: { user_name: user_name } };
  User.findOne(conditions).then((user) => {
    if (user) {
      bcrypt.compare(newPassword, user.password, (err, matched) => {
        if (matched) {
          return res.json({
            status: 400,
            errors: {
              newPassword:
                "Mật khẩu mới trùng với mật khẩu cũ, vui lòng nhập lại",
            },
          });
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, (err3, hash) => {
              if (err3) next(err3);
              user
                .update({ password: hash })
                .then((data) => {
                  res.json({ success: true });
                }) // fix trả về user
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some errors occurred.",
                  });
                });
            });
          });
        }
      });
    } else {
      return res.json({
        status: 400,
        errors: {
          user_name: "Tài khoản không tồn tại",
        },
      });
    }
  });
};

exports.searchUsers = (req, res) => {
  const { user_name } = req.body;
  let conditions = {
    where: { user_name: { [Op.like]: `%${user_name}%` } },
    include: [
      { model: WorkPlace, attributes: ["name"] },
      { model: Major, attributes: ["name"] },
    ],
  };
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  conditions["limit"] = parseInt(size);
  conditions["offset"] = page || page !== 0 ? size * (page - 1) : 0;

  User.findAll(conditions, { subQuery: false })
    .then((data) => {
      const users = data;
      conditions["distinct"] = true;
      conditions["col"] = "userId";
      User.count(conditions, { subQuery: false })
        .then((totalItems) => {
          const currentPage = page ? page : 1;
          const totalPages = Math.ceil(totalItems / size);
          res.send({ totalItems, users, currentPage, totalPages });
        })
        .catch((err) => {
          return res.json({
            status: 400,
            message: err.message || "Some errors occurred",
          });
        });
    })
    .catch((err) => {
      res.json({
        status: 400,
        message: err.message || "Some errors occurred",
      });
    });
};
