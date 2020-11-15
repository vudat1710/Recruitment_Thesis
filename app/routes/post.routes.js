var router = require("express").Router();
const posts = require("../controllers/post.controller.js");
router.post("/findPosts", posts.findPosts); 
router.post("/searchPosts", posts.searchPosts);
router.post("/getPostById", posts.getPostById);


module.exports = router;