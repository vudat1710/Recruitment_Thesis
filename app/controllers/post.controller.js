const { WorkPlacePost } = require("../models");
const db = require("../models");
const MajorPost = require("../models/MajorPost");
const Post = db.Post;
const WorkPlace = db.WorkPlace;
const Company = db.Company;
const Major = db.Major;
const Op = db.Sequelize.Op;
const CommentPost = db.CommentPost;
const RatePost = db.RatePost;

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
    conditions = {
      limit: parseInt(req.body.limit),
      attributes: attributesParams,
      order: [["valid_through", "ASC"]],
    };
  } else if (type == "all") {
    conditions = {};
  } else {
    conditions = { limit: parseInt(req.body.limit) };
  }

  conditions["include"] = [
    { model: WorkPlace, attributes: ["name"] },
    { model: Major, attributes: ["name"] },
    { model: Company, attributes: ["name", "description", "img_url"] },
    { model: CommentPost },
    { model: RatePost },
  ];

  Post.findAll(conditions, { subQuery: false })
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
  const postId = req.body.postId;
  Post.findOne({
    where: {
      postId: postId,
    },
    include: [
      {
        model: Company,
        attributes: ["name", "description", "img_url", "companyId"],
      },
      { model: WorkPlace, attributes: ["name"] },
      { model: Major, attributes: ["name"] },
      { model: CommentPost },
      { model: RatePost },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

exports.getPostByCompanyId = (req, res) => {
  const companyId = req.body.companyId;
  Post.findAll({
    where: {
      postId: postId,
    },
    include: [
      { model: Company, where: { companyId: companyId } },
      { model: WorkPlace, attributes: ["name"] },
      { model: Major, attributes: ["name"] },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

exports.getPostByMajorName = (req, res) => {
  const major = req.body.major;
  Post.findAll(
    {
      where: {
        postId: postId,
      },
      include: [
        { model: Company, attributes: ["name"] },
        { model: WorkPlace, attributes: ["name"] },
        { model: Major, attributes: ["name"], where: { name: major } },
      ],
    },
    { subQuery: false }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

exports.searchPosts = (req, res) => {
  let conditions = { where: {} };
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  for (const key in req.body) {
    if (
      key !== "workplace" &&
      key !== "major" &&
      key !== "size" &&
      key !== "page"
    ) {
      conditions.where[key] = req.body[key];
    }
  }
  conditions["limit"] = parseInt(size);
  conditions["offset"] = page || page === 0 ? size * (page - 1) : 0;

  conditions["include"] = [
    {
      model: Company,
      attributes: ["name", "description", "img_url", "companyId"],
    },
    { model: CommentPost },
    { model: RatePost },
  ];

  if ("workplace" in req.body) {
    conditions["include"].push({
      model: WorkPlace,
      attributes: ["name"],
      where: { name: req.body.workplace },
    });
  } else {
    conditions["include"].push({ model: WorkPlace, attributes: ["name"] });
  }

  if ("major" in req.body) {
    conditions["include"].push({
      model: Major,
      attributes: ["name"],
      where: { name: req.body.major },
    });
  } else {
    conditions["include"].push({ model: Major, attributes: ["name"] });
  }

  Post.findAndCountAll(conditions, { subQuery: false })
    .then((data) => {
      const { count: totalItems, rows: posts } = data;
      const currentPage = page ? page : 0;
      const totalPages = Math.ceil(totalItems / size);

      res.send({ totalItems, posts, currentPage, totalPages });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.comment = (req, res) => {
  const { content, postId, userId } = req.body;

  CommentPost.create({ content: content, postId: postId, userId: userId })
    .then((data) => {
      res.json({ success: true, message: "Comment has been posted" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.rate = (req, res) => {
  const { rate, postId, userId } = req.body;

  CommentPost.create({ rate: rate, postId: postId, userId: userId })
    .then((data) => {
      res.json({ success: true, message: "Rate has been posted" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.compare = (req, res) => {
  const { compareList, userId } = req.body;

  const p = Post.findAll({
    where: {
      postId: compareList,
    },
    include: [
      { model: Company, attributes: ["name"] },
      { model: WorkPlace, attributes: ["name"] },
      { model: Major, attributes: ["name"] },
      { model: CommentPost },
      { model: RatePost },
    ],
  });

  const u = User.findOne({ where: { userId: userId } });

  Promise.all([p, u])
    .then((response) => {
      const userWorkPlace = response[1].WorkPlaces.map(a => a.name);
      const wpPost1 = response[0][0].WorkPlaces.map(a => a.name).filter(
        (e) => userWorkPlace.includes(e)
      );
      const wpPost2 = response[0][1].WorkPlaces.map(a => a.name).filter(
        (e) => userWorkPlace.includes(e)
      );
      const userMajor = response[1].Majors.map(a => a.name);
      const majorPost1 = response[0][0].Majors.map(a => a.name).filter(
        (e) => userMajor.includes(e)
      );
      const majorPost2 = response[0][1].Majors.map(a => a.name).filter(
        (e) => userMajor.includes(e)
      );
      const genderPost1 = (response[0][0].gender === response[1].gender || response[0][0].gender === "Không yêu cầu");
      const genderPost2 = (response[0][1].gender === response[1].gender || response[0][1].gender === "Không yêu cầu");
      const expPost1 = (response[0][0].experience <= response[1].experience || response[0][0].experience === 99);
      const expPost2 = (response[0][1].experience <= response[1].experience || response[0][1].experience === 99);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred.",
      });
    });
};

exports.addPost = (req, res) => {};

exports.deletePost = (req, res) => {};

exports.updatePost = (req, res) => {};
