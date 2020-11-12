var router = require("express").Router();
const users = require("../controllers/user.controller.js");
router.post("/register", users.createUser); 
// router.get("/login", users.login);

module.exports = router;