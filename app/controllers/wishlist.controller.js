const db = require("../models");
const User = db.User;
const Post = db.Post;
const WishList = db.WishList;
const Op = db.Sequelize.Op;

exports.addToWishList = (req, res) => {
  const { postId, userId } = req.body;

  WishList.findAll({
    where: {
      postId: postId,
      userId: userId,
    },
  })
    .then((data) => {
      if (!data) {
        WishList.create({ userId: userId, postId: postId });
        res.json({success: true, message: "Post added to wishlist"});
      } else {
        res.json({success: true, message: "Post already added to wishlist"});
      }
      
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.removeFromWishList = (req, res) => {
    const { postId, userId } = req.body;
  
    WishList.findAll({
      where: {
        postId: postId,
        userId: userId,
      },
    })
      .then((data) => {
        if (!data) {
          WishList.destroy({ userId: userId, postId: postId });
          res.json({success: true, message: "Post removed from wishlist"});
        } else {
          res.json({success: true, message: "Post is not in wishlist"});
        }
        
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some errors occurred while retrieving all posts.",
        });
      });
  };
