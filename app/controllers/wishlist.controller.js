const db = require("../models");
const WorkPlace = db.WorkPlace;
const Post = db.Post;
const WishList = db.WishList;
const Company = db.Company;
const Major = db.Major;
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
      console.log(data);
      if (data.length === 0) {
        WishList.create({ userId: userId, postId: postId }).then((x) => {
          if (x) {
            res.json({ success: true, message: "Post added to wishlist" });
          }
        });
      } else {
        res.json({ success: true, message: "Post already added to wishlist" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.getWishList = (req, res) => {
  const { userId } = req.body;

  WishList.findAll({
    where: { userId: userId },
    attributes: ["postId"],
  })
    .then((data) => {
      if (data) {
        const postIds = data.map((a) => a.postId);
        Post.findAll(
          {
            where: {
              postId: postIds,
            },
            include: [
              {
                model: Company,
                attributes: ["name", "description", "img_url", "companyId"],
              },
              { model: WorkPlace, attributes: ["name"] },
              { model: Major, attributes: ["name"] },
            ],
          },
          { subQuery: false }
        )
          .then((posts) => {
            res.send({ posts});
          })
          .catch((err) => {
            return res.json({
              status: 400,
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          });
      } else {
        res.send({ posts: [] });
      }
    })
    .catch((err) => {
      return res.json({
        status: 400,
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
      if (data.length !== 0) {
        WishList.destroy({ where:{ userId: userId, postId: postId }})
          .then(() => {
            res.json({ success: true, message: "Post removed from wishlist" });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          });
      } else {
        res.json({ success: true, message: "Post is not in wishlist" });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};
