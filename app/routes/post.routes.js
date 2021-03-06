var router = require("express").Router();
const passport = require('passport');
const posts = require("../controllers/post.controller.js");
router.post("/findPosts", posts.findPosts); 
router.post("/searchPosts", posts.searchPosts);
router.post("/getPostById", posts.getPostById);
router.post("/getPostByCompanyId", posts.getPostByCompanyId)
router.post("/addPostAdmin", posts.addPost);
router.post("/deletePostAdmin", posts.deletePostFlag);
router.post("/updatePostAdmin", posts.updatePost);
router.post("/comment", passport.authenticate('jwt', { session: false }), posts.comment);
router.post("/deleteComment", passport.authenticate('jwt', { session: false }), posts.deleteComment);
router.post("/rate", passport.authenticate('jwt', { session: false }), posts.rate);
router.post("/compare", passport.authenticate('jwt', { session: false }), posts.compare);
router.post("/getLikedPosts", passport.authenticate('jwt', { session: false }), posts.getLikedPosts);
router.post("/deleteCommentAdmin", posts.deleteComment);
router.post("getRateByUserIdPostId", posts.getRateByUserIdPostId);
router.post("/getCommentByPostId", posts.getCommentByPostId);
router.post("/searchComments", posts.searchComments);

module.exports = router;