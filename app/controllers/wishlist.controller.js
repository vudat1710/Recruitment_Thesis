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
      if (data.length === 0) {
        const q = new Date();
        const m = q.getMonth() + 1;
        const d = q.getDate();
        const y = q.getFullYear();
        const currentDate = y + "-" + m + "-" + d;
        WishList.create({
          userId: userId,
          postId: postId,
          createdAt: currentDate,
        }).then((x) => {
          if (x) {
            res.json({ success: true, message: "Post added to wishlist" });
          }
        });
      } else {
        res.json({ success: true, message: "Post already added to wishlist" });
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

exports.getWishList = (req, res) => {
  const { userId } = req.body;

  WishList.findAll({
    where: { userId: userId },
    attributes: ["postId"],
  })
    .then((data) => {
      if (data !== null && data.length !== 0) {
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
            order: [["createdAt", "DESC"]],
          },
          { subQuery: false }
        )
          .then((posts) => {
            res.send({ posts });
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

exports.searchPostsByTitle = (req, res) => {
  const today = new Date();
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  let conditions = {
    where: {
      [Op.and]: [
        db.sequelize.where(db.sequelize.col("valid_through"), ">", today),
      ],
    },
  };

  if ("title" in req.body) {
    // console.log(req.body.title)
    conditions.where["title"] = { [Op.like]: `%${req.body.title}%` }
  }

  conditions["order"] = [["createdAt", "DESC"]];
  conditions["limit"] = parseInt(size);
  conditions["offset"] = page || page !== 0 ? size * (page - 1) : 0;

  conditions["include"] = [
    {
      model: Company,
      attributes: ["name", "description", "img_url", "companyId"],
    },
    { model: WorkPlace, attributes: ["name"] },
    { model: Major, attributes: ["name"] },
  ];

  WishList.findAll({ where: { userId: req.body.userId } }, { subQuery: false })
    .then((data) => {
      const postIds = data.map((a) => a.postId);
      conditions.where["postId"] = postIds;
      Post.findAll(conditions, { subQuery: true })
        .then((data) => {
          const posts = data;
          conditions["distinct"] = true;
          conditions["col"] = "postId";
          Post.count(conditions, { subQuery: false })
            .then((totalItems) => {
              const currentPage = page ? page : 1;
              const totalPages = Math.ceil(totalItems / size);
              res.send({ totalItems, posts, currentPage, totalPages });
            })
            .catch((err) => {
              return res.json({
                status: 400,
                message:
                  err.message ||
                  "Some errors occurred while retrieving all posts.",
              });
            });
        })
        .catch((err) => {
          res.json({
            status: 400,
            message:
              err.message || "Some errors occurred while retrieving all posts.",
          });
        });
    })
    .catch((err) => {
      res.json({
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
        WishList.destroy({ where: { userId: userId, postId: postId } })
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
