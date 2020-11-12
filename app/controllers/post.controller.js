const { WorkPlacePost } = require("../models");
const db = require("../models");
const MajorPost = require("../models/MajorPost");
const Post = db.Post;
const WorkPlace = db.WorkPlace;
const Company = db.Company;
const Major = db.Major;
const Op = db.Sequelize.Op;

exports.createPost = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can't be empty!",
    });
    return;
  }

  const post = {
    title: req.body.title,
    description: req.body.description,
    gender: req.body.gender,
    extra_requirements: req.body.extra_requirements,
    job_benefits: req.body.job_benefits,
    salary: req.body.salary,
    experience: req.body.experience,
    job_type: req.body.job_type,
    num_hiring: req.body.num_hiring,
    valid_through: req.body.valid_through,
    address: req.body.address,
    post_url: req.body.post_url,
    qualification: req.body.qualification,
    position: req.body.position,
    contact_name: req.body.contact_name,
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
  const type = req.body.type;
  const attributesParams = req.body.attributes;
  let conditions;
  if (type == "home") {
    conditions = { limit: parseInt(req.body.limit), attributes: attributesParams, order: [["valid_through", "ASC"]] };
  } else if (type == "all") {
    conditions = {};
  } else {
    conditions = { limit: parseInt(req.body.limit) };
  }

  conditions["include"] = [{model: db.WorkPlace, attributes: ["name"]}, {model: db.Major, attributes: ["name"]}, {model: db.Company, attributes: ["name", "description", "img_url"]}];

  Post.findAll(conditions,{subQuery: false})
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

exports.getNumPosts = (req, res) => {
  Post.count()
    .then((data) => {
      res.send(data.toString());
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some errors happened",
      });
    });
};

exports.getPostById = (req, res) => {
  const id = req.body.id;

  Post.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};
