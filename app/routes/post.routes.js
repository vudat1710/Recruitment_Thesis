var router = require("express").Router();
const posts = require("../controllers/post.controller.js");
router.post("/findPosts", posts.findPosts); 
router.get("/getNumPosts", posts.getNumPosts);

module.exports = router;