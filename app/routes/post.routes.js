module.exports = app => {
    const posts = require("../controllers/post.controller.js");
  
    var router = require("express").Router();

    // Retrieve all posts
    router.get("/post/findPosts", posts.findPosts);
  

  };