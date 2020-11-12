const { WorkPlacePost } = require("../models");
const db = require("../models");
const MajorPost = require("../models/MajorPost");
const bcrypt = require('bcryptjs');
const jwtOptions = {};
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const User = db.User;
const WorkPlace = db.WorkPlace;
const Major = db.Major;
const Op = db.Sequelize.Op;

exports.createUser = (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!req.body.user_name) {
    res.status(400).send({
      message: "User data can't be empty!",
    });
    return;
  }

  User.findOne({ where: {user_name: req.body.user_name} }).then((user) => {
      if (user) {
        errors.phone = 'Phone already exists';
        return res.status(400).json(errors);
      }

      const newUser = {
        user_name: req.body.user_name,
        password: req.body.password,
        gender: req.body.gender,
        year_of_birth: req.body.year_of_birth,
        is_lock: false
      };
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err3, hash) => {
          if (err3) next(err3);
          newUser.password = hash;
          User.create(newUser)
            .then((data) => {
                res.json({ success: true });
            }) // fix trả về user
            .catch(
              (err) => {
                res.status(500).send({
                  message:
                    err.message || "Some errors occurred while retrieving all posts.",
                });
              }
            );
        });
    });
  })
};

exports.login = (req, res, next) => {
    const { name, password } = req.body;
    if (name && password) {
        // we get the user with the name and save the resolved promise
        let user = await User.findOne({ where: {user_name: name} });
        if (!user) {
            res.status(401).json({ msg: 'No such user found', user });
        }
    if (user.password === password) {
        // from now on we’ll identify the user by the id and the id is
    // the only personalized value that goes into our token
        let payload = { id: user.userId };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ msg: 'ok', token: token });
        } else {
            res.status(401).json({ msg: 'Password is incorrect' });
        }
    }
}
