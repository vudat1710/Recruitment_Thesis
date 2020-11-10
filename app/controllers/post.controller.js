const db = require("../models");
const Post = db.post;
const Op = db.Sequelize.Op;

exports.createPost = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can't be empty!",
    });
    return;
  }

  const post = {
    title: req.params.title,
    description: req.params.description,
    gender: req.params.gender,
    extra_requirements: req.params.extra_requirements,
    job_benefits: req.params.job_benefits,
    salary: req.params.salary,
    experience: req.params.experience,
    job_type: req.params.job_type,
    num_hiring: req.params.num_hiring,
    valid_through: req.params.valid_through,
    address: req.params.address,
    post_url: req.params.post_url,
    qualification: req.params.qualification,
    position: req.params.position,
    contact_name: req.params.contact_name,
  };

  Post.create(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errs occurred while creating a post.",
      });
    });
};

exports.findPosts = (req, res) => {
  const type = req.params.type;
  const attributesParams = req.params.attributes;
  let conditions;
  if (type == "home") {
    conditions = { limit: req.params.limit, order: ["valid_through", "ASC"], attributes: attributesParams };
  } else if (type == "all") {
    conditions = {};
  } else {
    conditions = { limit: req.params.limit };
  }
  Post.findAll(conditions)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.getPostById = (req, res) => {
  const id = req.params.id;

  Tutorial.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};
