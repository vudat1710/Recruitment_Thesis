const db = require("../models");
const User = db.User;
const Post = db.Post;
const Company = db.Company;
const Major = db.Major;
const WorkPlace = db.WorkPlace;
const MajorItem = db.MajorItem;
const MajorPost = db.MajorPost;
const WorkPlacePost = db.WorkPlacePost;
const WorkPlaceUser = db.WorkPlaceUser;
const Op = db.Sequelize.Op;

exports.getMajorStats = (req, res) => {
  Major.findAndCountAll()
    .then((data) => {
      let allReq = [];
      const { count: totalMajors, rows: majors } = data;
      let result = { numMajors: totalMajors, details: {} };
      for (let i = 0; i < majors.length; i++) {
        const major = majors[i];
        const item = MajorPost.count({
          where: {
            majorId: major.majorId,
          },
        });
        allReq.push(item);
      }

      Promise.all(allReq)
        .then((response) => {
          for (let i = 0; i < response.length; i++) {
            result.details[majors[i].name] = response[i];
          }
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some errors occurred.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getWorkPlaceStats = (req, res) => {
  WorkPlace.findAndCountAll()
    .then((data) => {
      let allReq = [];
      const { count: totalWorkPlaces, rows: workplaces } = data;
      let result = { numWorkPlaces: totalWorkPlaces, details: {} };
      for (let i = 0; i < workplaces.length; i++) {
        const workplace = workplaces[i];
        const item = WorkPlacePost.count({
          where: {
            workPlaceId: workplace.workPlaceId,
          },
        });
        allReq.push(item);
      }

      Promise.all(allReq)
        .then((response) => {
          for (let i = 0; i < response.length; i++) {
            result.details[workplaces[i].name] = response[i];
          }
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some errors occurred.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getJobTypeStats = (req, res) => {
  let result = {};
  Post.findAndCountAll({
    attributes: [
      [db.sequelize.fn("DISTINCT", db.sequelize.col("job_type")), "job_type"],
    ],
  })
    .then((data) => {
      const { rows: jobTypes } = data;
      let allReq = [];
      for (let i = 0; i < jobTypes.length; i++) {
        const jobType = jobTypes[i];
        const item = Post.count({
          where: {
            job_type: jobType.job_type,
          },
        });
        allReq.push(item);
      }

      Promise.all(allReq)
        .then((response) => {
          for (let i = 0; i < response.length; i++) {
            result[jobTypes[i].job_type] = response[i];
          }
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some errors occurred.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getExperienceStats = (req, res) => {
  let result = {};
  Post.findAndCountAll({
    attributes: [
      [
        db.sequelize.fn("DISTINCT", db.sequelize.col("experience")),
        "experience",
      ],
    ],
  })
    .then((data) => {
      const { rows: experienceTypes } = data;
      let allReq = [];
      for (let i = 0; i < experienceTypes.length; i++) {
        const experienceType = experienceTypes[i];
        const item = Post.count({
          where: {
            experience: experienceType.experience,
          },
        });
        allReq.push(item);
      }

      Promise.all(allReq)
        .then((response) => {
          for (let i = 0; i < response.length; i++) {
            result[experienceTypes[i].experience] = response[i];
          }
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some errors occurred.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getGenderStats = (req, res) => {
  let result = {};
  Post.findAndCountAll({
    attributes: [
      [db.sequelize.fn("DISTINCT", db.sequelize.col("gender")), "gender"],
    ],
  })
    .then((data) => {
      const { rows: genders } = data;
      let allReq = [];
      for (let i = 0; i < genders.length; i++) {
        const gender = genders[i];
        const item = Post.count({
          where: {
            gender: gender.gender,
          },
        });
        allReq.push(item);
      }

      Promise.all(allReq)
        .then((response) => {
          for (let i = 0; i < response.length; i++) {
            result[genders[i].gender] = response[i];
          }
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some errors occurred.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getSalaryStats = (req, res) => {
    let result = {};
    Post.findAndCountAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("salary_type")), "salary_type"],
      ],
    })
      .then((data) => {
        const { rows: salaryTypes } = data;
        let allReq = [];
        for (let i = 0; i < salaryTypes.length; i++) {
          const salaryType = salaryTypes[i];
          const item = Post.count({
            where: {
              salary_type: salaryType.salary_type,
            },
          });
          allReq.push(item);
        }
  
        Promise.all(allReq)
          .then((response) => {
            for (let i = 0; i < response.length; i++) {
              result[salaryTypes[i].salary_type] = response[i];
            }
            res.send(result);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some errors occurred.",
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some errors occurred.",
        });
      });
};
