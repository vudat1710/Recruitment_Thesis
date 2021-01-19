var router = require("express").Router();
const passport = require('passport');
const users = require("../controllers/user.controller.js");
router.post("/register", users.register); 
router.post("/login", users.login);
router.post("/findUserByUserName", users.findUserByUserName);
router.post("/findUserById", users.findUserById);
router.post("/updateUser", passport.authenticate('jwt', { session: false }), users.updateUser);
router.post("/lockAccount", users.lockAccount);
router.post("/unlockAccount", users.unlockAccount);
router.post("/searchUsers", users.searchUsers);
router.post("/changePassword", passport.authenticate('jwt', { session: false }), users.changePassword);
router.post("/forgotPassword", users.forgotPassword);
router.post("/isLock", users.isLock);

module.exports = router;