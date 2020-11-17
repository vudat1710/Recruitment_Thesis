const db = require("../models");
const Post = db.Post;
const WorkPlace = db.WorkPlace;
const Major = db.Major;
const Op = db.Sequelize.Op;

exports.getDataAutoComplete = (req, res) => {
  returnData = {};
  const positions = Post.findAll({
    attributes: [
      [db.Sequelize.fn("DISTINCT", db.Sequelize.col("position")), "position"],
    ],
  });
  const job_types = Post.findAll({
    attributes: [
      [db.Sequelize.fn("DISTINCT", db.Sequelize.col("job_type")), "job_type"],
    ],
  });

  const experience = Post.findAll({
    attributes: [
      [
        db.Sequelize.fn("DISTINCT", db.Sequelize.col("experience")),
        "experience",
      ],
    ],
  });

  const salary = Post.findAll({
    attributes: [
      [db.Sequelize.fn("DISTINCT", db.Sequelize.col("salary_type")), "salary_type"],
    ],
  });

  const majors = Major.findAll({attributes: ['name']});
  const workplaces = WorkPlace.findAll({attributes: ['name']});
  const num_posts = Post.count();

  Promise.all([positions, job_types, experience, salary, majors, workplaces, num_posts])
    .then((responses) => {
      returnData["positions"] = responses[0].map(a => a.position);
      returnData["job_types"] = responses[1].map(a => a.job_type);
      returnData["experience"] = responses[2].map(a => a.experience);
      returnData["salary_types"] = responses[3].map(a => a.salary_type);
      returnData["majors"] = responses[4].map(a => a.name);
      returnData["workplaces"] = responses[5].map(a => a.name);
      returnData["num_posts"] = responses[6];
      res.send(returnData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};
