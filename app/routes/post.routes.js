var router = require("express").Router();
const posts = require("../controllers/post.controller.js");
router.post("/findPosts", posts.findPosts); 
router.post("/searchPosts", posts.searchPosts);
router.post("/getPostById", posts.getPostById);
router.post("/addPost", posts.addPost);
router.post("/deletePost", posts.deletePost);
router.post("/updatePost", posts.updatePost);
router.post("/comment", posts.comment);
router.post("/deleteComment", posts.deleteComment);
router.post("/rate", posts.rate);
router.post("/compare", posts.compare);

module.exports = router;