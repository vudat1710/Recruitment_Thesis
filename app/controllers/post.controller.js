const { User } = require("../models");
const db = require("../models");
const Post = db.Post;
const WorkPlace = db.WorkPlace;
const Company = db.Company;
const Major = db.Major;
const Op = db.Sequelize.Op;
const CommentPost = db.CommentPost;
const RatePost = db.RatePost;
const WorkPlacePost = db.WorkPlacePost;
const WishList = db.WishList;
const MajorPost = db.MajorPost;
const PostCompany = db.PostCompany;
const validatePostInput = require("../validation/post");

function convertToObject(array, externalKey, externalValue, key) {
  let res = [];
  // console.log(array.length)
  for (const item in array) {
    let newItem = {};
    newItem[key] = parseInt(array[item]);
    newItem[externalKey] = externalValue;
    res.push(newItem);
  }

  return res;
}

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
      res.send({
        status: 400,
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
      res.send({
        status: 400,
        message: "Error retrieving Post",
      });
    });
};

exports.getPostByCompanyId = (req, res) => {
  const companyId = req.body.companyId;
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  let conditions = {
    include: [
      { model: Company, where: { companyId: companyId } },
      { model: WorkPlace, attributes: ["name"] },
      { model: Major, attributes: ["name"] },
    ],
    limit: size,
    offset: page || page !== 0 ? size * (page - 1) : 0,
  };

  Post.findAll(conditions)
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

exports.getPostByMajorName = (req, res) => {
  const major = req.body.major;
  Post.findAll(
    {
      where: {
        postId: postId,
      },
      include: [
        { model: Company, attributes: ["name", "companyId"] },
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
      res.send({
        status: 400,
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
  conditions["offset"] = page || page !== 0 ? size * (page - 1) : 0;

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

  Post.findAll(conditions, { subQuery: false })
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

exports.comment = (req, res) => {
  const { content, postId, userId } = req.body;

  CommentPost.create({ content: content, postId: postId, userId: userId })
    .then((data) => {
      res.json({ success: true, message: "Comment has been posted" });
    })
    .catch((err) => {
      res.send({
        status: 400,
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};

exports.rate = (req, res) => {
  const { rate, postId, userId } = req.body;

  RatePost.findOne({
    where: { userId: userId, postId: postId },
  })
    .then((data) => {
      if (!data.id) {
        RatePost.create({ rate: rate, postId: postId, userId: userId })
          .then((data) => {
            res.json({ success: true, message: "Rate has been posted" });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message: err.message || "Some errors occurred.",
            });
          });
      } else {
        // console.log(data)
        data
          .update({ rate: rate, postId: postId, userId: parseInt(userId) })
          .then((x) => {
            console.log(x);
            res.send({ success: true, message: "Rate has been updated" });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message: err.message || "Some errors occurred.",
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getCommentByPostId = (req, res) => {
  const { postId } = req.body;

  CommentPost.findAll({ where: { postId, postId }, include: [User] })
    .then((comments) => {
      if (comments.length !== 0) {
        res.send(comments);
      } else {
        res.send({ comments: [] });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getRateByUserIdPostId = (req, res) => {
  const { userId, postId } = req.body;

  RatePost.findAll({
    where: { userId: userId, postId: postId },
  })
    .then((data) => {
      if (data.length === 0) {
        res.send({ rate: 0 });
      } else {
        const rate = data[0].rate;
        res.send({ rate: rate });
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.compare = (req, res) => {
  const { compareList, userId } = req.body;

  if (compareList.length < 2) {
    res.json({
      success: false,
      message: "Not enough post to compare",
    });
  } else {
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

    const u = User.findOne({
      where: { userId: userId },
      include: [
        { model: WorkPlace, attributes: ["name"] },
        { model: Major, attributes: ["name"] },
      ],
    });

    Promise.all([p, u])
      .then((response) => {
        let data = {};
        const postId1 = response[0][0].postId;
        const postId2 = response[0][1].postId;

        const userWorkPlace = response[1].WorkPlaces.map((a) => a.name);

        const wpPost1 = response[0][0].WorkPlaces.map(
          (a) => a.name
        ).filter((e) => userWorkPlace.includes(e));
        const wpPost2 = response[0][1].WorkPlaces.map(
          (a) => a.name
        ).filter((e) => userWorkPlace.includes(e));

        const userMajor = response[1].Majors.map((a) => a.name);
        const majorPost1 = response[0][0].Majors.map(
          (a) => a.name
        ).filter((e) => userMajor.includes(e));
        const majorPost2 = response[0][1].Majors.map(
          (a) => a.name
        ).filter((e) => userMajor.includes(e));
        const genderPost1 =
          response[0][0].gender === response[1].gender ||
          response[0][0].gender === "Không yêu cầu";
        const genderPost2 =
          response[0][1].gender === response[1].gender ||
          response[0][1].gender === "Không yêu cầu";
        const expPost1 =
          response[0][0].experience <= response[1].experience ||
          response[0][0].experience === 99;
        const expPost2 =
          response[0][1].experience <= response[1].experience ||
          response[0][1].experience === 99;
        const qualPost1 = response[0][0].qualification
          .split(",")
          .map((a) => a.trim())
          .includes(response[1].qualification);
        const qualPost2 = response[0][1].qualification
          .split(",")
          .map((a) => a.trim())
          .includes(response[1].qualification);
        let salaryPost1, salaryPost2, minSalPost1, maxSalPost1;
        const sal1 = response[0][0].salary_type;
        const sal2 = response[0][1].salary_type;
        if (sal1 === "Thoả thuận" || sal2 === "Thoả thuận") {
          salaryPost1 = !(sal1 === "Thoả thuận");
          salaryPost2 = !(sal2 === "Thoả thuận");
        } else {
          const minSal1 = response[0][0].min_value;
          const maxSal1 = response[0][0].max_value;
          const minSal2 = response[0][1].min_value;
          const maxSal2 = response[0][1].max_value;
          minSalPost1 = minSal1 > minSal2;
          maxSalPost1 = maxSal1 > maxSal2;
        }

        data[postId1] = {
          workplace: wpPost1,
          major: majorPost1,
          gender: genderPost1,
          experience: expPost1,
          qualification: qualPost1,
          salary: {
            deal: salaryPost1,
            min: minSalPost1,
            max: maxSalPost1,
          },
        };

        data[postId2] = {
          workplace: wpPost2,
          major: majorPost2,
          gender: genderPost2,
          experience: expPost2,
          qualification: qualPost2,
          salary: {
            deal: salaryPost2,
            min: !minSalPost1,
            max: !maxSalPost1,
          },
        };

        res.json({
          success: true,
          data,
        });
      })

      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  }
};

exports.addPost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }

  let conditions = { Companies: [{ PostCompany: { selfGranted: true } }] };

  for (key in req.body) {
    if (
      key !== "name" &&
      key !== "company_description" &&
      key !== "company_address" &&
      key !== "img_url" &&
      key !== "majors" &&
      key !== "workplaces"
    ) {
      conditions[key] = req.body[key];
    } else {
      if (key === "company_description") key = "description";
      if (key === "company_address") key = "address";
      conditions.Companies[0][key] = req.body[key];
    }
  }

  let otherConditions = {};
  for (key in req.body) {
    if (
      key !== "name" &&
      key !== "company_description" &&
      key !== "company_address" &&
      key !== "img_url" &&
      key !== "majors" &&
      key !== "workplaces"
    )
      otherConditions[key] = req.body[key];
  }

  Company.findOne({ where: { name: req.body.name } }).then((company) => {
    if (!company) {
      Post.create(conditions, { include: [Company] })
        .then((x) => {
          const postId = x.postId;
          const a = Major.findAll({
            where: {
              name: req.body.majors,
            },
            attributes: ["majorId"],
          });
          const b = WorkPlace.findAll({
            where: {
              name: req.body.workplaces,
            },
            attributes: ["workPlaceId"],
          });

          Promise.all([a, b])
            .then((response) => {
              const c = WorkPlacePost.bulkCreate(
                convertToObject(
                  response[1].map((a) => a.workPlaceId),
                  "postId",
                  postId,
                  "workPlaceId"
                )
              );
              const d = MajorPost.bulkCreate(
                convertToObject(
                  response[0].map((a) => a.majorId),
                  "postId",
                  postId,
                  "majorId"
                )
              );

              Promise.all([c, d])
                .then((response) => {
                  res.json({
                    success: true,
                    message: "Add post successful",
                  });
                })
                .catch((err) => {
                  res.send({
                    status: 400,
                    message:
                      err.message ||
                      "Some errors occurred while creating post.",
                  });
                });
            })
            .catch((err) => {
              res.send({
                status: 400,
                message:
                  err.message || "Some errors occurred while creating post.",
              });
            });
        })
        .catch((err) => {
          res.send({
            status: 400,
            message: err.message || "Some errors occurred while creating post.",
          });
        });
    } else {
      const companyId = company.companyId;
      Post.create(otherConditions)
        .then((x) => {
          const postId = x.postId;
          const a = Major.findAll({
            where: {
              name: req.body.majors,
            },
            attributes: ["majorId"],
          });
          const b = WorkPlace.findAll({
            where: {
              name: req.body.workplaces,
            },
            attributes: ["workPlaceId"],
          });

          Promise.all([a, b])
            .then((response) => {
              const c = WorkPlacePost.bulkCreate(
                convertToObject(
                  response[1].map((a) => a.workPlaceId),
                  "postId",
                  postId,
                  "workPlaceId"
                )
              );
              const d = MajorPost.bulkCreate(
                convertToObject(
                  response[0].map((a) => a.majorId),
                  "postId",
                  postId,
                  "majorId"
                )
              );

              const e = PostCompany.create({
                postId: postId,
                companyId: companyId,
              });

              Promise.all([c, d, e])
                .then((response) => {
                  res.json({
                    success: true,
                    message: "Add post successful",
                  });
                })
                .catch((err) => {
                  res.send({
                    status: 400,
                    message:
                      err.message ||
                      "Some errors occurred while creating post.",
                  });
                });
            })
            .catch((err) => {
              res.send({
                status: 400,
                message:
                  err.message || "Some errors occurred while creating post.",
              });
            });
        })
        .catch((err) => {
          res.send({
            status: 400,
            message: err.message || "Some errors occurred while creating post.",
          });
        });
    }
  });
};

exports.deletePost = (req, res) => {
  const { postId } = req.body;
  const a = MajorPost.destroy({ where: { postId: postId } });
  const b = CommentPost.destroy({ where: { postId: postId } });
  const c = RatePost.destroy({ where: { postId: postId } });
  const d = WishList.destroy({ where: { postId: postId } });
  const e = WorkPlacePost.destroy({ where: { postId: postId } });
  const f = PostCompany.destroy({ where: { postId: postId } });
  Promise.all([a, b, c, d, e, f])
    .then((response) => {
      Post.destroy({ where: { postId: postId } })
        .then((data) => {
          res.json({ success: true, message: "Post has been deleted" });
        })
        .catch((err) => {
          res.send({
            status: 400,
            message: err.message || "Some errors occurred while deleting post.",
          });
        });
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Some errors occurred while deleting post.",
      });
    });
};

exports.updatePost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { postId, majors, workplaces } = req.body;

  Post.findOne({
    where: { postId: postId },
    include: [
      { model: WorkPlace, attributes: ["workPlaceId"] },
      { model: Major, attributes: ["majorId"] },
    ],
  }).then((post) => {
    if (post) {
      const majorIdsExist = post.Majors.map((a) => a.majorId);
      const workPlaceIdsExist = post.WorkPlaces.map((a) => a.workPlaceId);

      const updatePost = post.update({
        experience: req.body.experience ? req.body.experience : post.experience,
        qualification: req.body.qualification
          ? req.body.qualification
          : post.qualification,
        salary_type: req.body.salary_type
          ? req.body.salary_type
          : post.salary_type,
        job_type: req.body.job_type ? req.body.job_type : post.job_type,
        gender: req.body.gender ? req.body.gender : post.gender,
        title: req.body.title ? req.body.title : post.title,
        min_value: req.body.min_value ? req.body.min_value : post.min_value,
        max_value: req.body.max_value ? req.body.max_value : post.max_value,
        num_hiring: req.body.num_hiring ? req.body.num_hiring : post.num_hiring,
        valid_through: req.body.valid_through
          ? req.body.valid_through
          : post.valid_through,
        address: req.body.address ? req.body.address : post.address,
        extra_requirements: req.body.extra_requirements
          ? req.body.extra_requirements
          : post.extra_requirements,
        description: req.body.description
          ? req.body.description
          : post.description,
        job_benefits: req.body.job_benefits
          ? req.body.job_benefits
          : post.job_benefits,
        post_url: req.body.post_url ? req.body.post_url : post.post_url,
        position: req.body.position ? req.body.position : post.position,
        contact_name: req.body.contact_name
          ? req.body.contact_name
          : post.contact_name,
      });

      const majorIds = Major.findAll({
        where: {
          name: majors,
        },
        attributes: ["majorId"],
      });

      const workPlaceIds = WorkPlace.findAll({
        where: {
          name: workplaces,
        },
        attributes: ["workPlaceId"],
      });

      Promise.all([updatePost, majorIds, workPlaceIds]).then((response) => {
        const newMajorIds = response[1].map((a) => a.majorId);
        const newWorkPlaceIds = response[2].map((a) => a.workPlaceId);
        const deleteMajorIds = majorIdsExist.filter(
          (e) => !newMajorIds.includes(e)
        );
        const addMajorIds = newMajorIds.filter(
          (e) => !majorIdsExist.includes(e)
        );
        const a = MajorPost.bulkCreate(
          convertToObject(addMajorIds, "userId", post.postId, "majorId")
        );

        const b = MajorPost.destroy({
          where: {
            postId: post.postId,
            majorId: deleteMajorIds,
          },
        });

        const deleteWorkPlaceIds = workPlaceIdsExist.filter(
          (e) => !newWorkPlaceIds.includes(e)
        );
        const addWorkPlaceIds = newWorkPlaceIds.filter(
          (e) => !workPlaceIdsExist.includes(e)
        );
        const c = WorkPlacePost.bulkCreate(
          convertToObject(addWorkPlaceIds, "userId", post.postId, "workPlaceId")
        );

        const d = WorkPlacePost.destroy({
          where: {
            postId: post.postId,
            workPlaceId: deleteWorkPlaceIds,
          },
        });

        Promise.all([a, b, c, d])
          .then((response) => {
            res.json({
              success: true,
            });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message:
                err.message ||
                "Some errors occurred while retrieving all posts.",
            });
          });
      });
    }
  });
};

exports.deleteComment = (req, res) => {
  const { id } = req.body;

  CommentPost.destroy({
    where: {
      id: id,
    },
  })
    .then((data) => {
      res.json({ success: true, message: "Comment has been deleted" });
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Some errors occurred while deleting comment.",
      });
    });
};
