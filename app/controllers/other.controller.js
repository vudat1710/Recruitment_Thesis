const db = require("../models");
const Post = db.Post;
const WorkPlace = db.WorkPlace;
const Major = db.Major;
const Company = db.Company;
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
      [
        db.Sequelize.fn("DISTINCT", db.Sequelize.col("salary_type")),
        "salary_type",
      ],
    ],
  });

  const majors = Major.findAll({ attributes: ["name"] });
  const workplaces = WorkPlace.findAll({ attributes: ["name"] });
  const num_posts = Post.count({where: {is_deleted: 0}});
  const num_companies = Company.count();

  const qualifications = Post.findAll({
    attributes: [
      [
        db.Sequelize.fn("DISTINCT", db.Sequelize.col("qualification")),
        "qualification",
      ],
    ],
  });

  Promise.all([
    positions,
    job_types,
    experience,
    salary,
    majors,
    workplaces,
    num_posts,
    qualifications,
    num_companies,
  ])
    .then((responses) => {
      returnData["positions"] = responses[0].map((a) => a.position);
      returnData["job_types"] = responses[1].map((a) => a.job_type);
      returnData["experience"] = responses[2].map((a) => a.experience);
      returnData["salary_types"] = responses[3].map((a) => a.salary_type);
      returnData["majors"] = responses[4].map((a) => a.name);
      returnData["workplaces"] = responses[5].map((a) => a.name);
      returnData["num_posts"] = responses[6];
      let a = [];
      responses[7] = responses[7].map(a => a.qualification);
      for (let i = 0; i < responses[7].length; i++) {
        const temp = responses[7][i].split(",");
        for (let j = 0; j < temp.length; j++) {
          const tempEle = temp[j].trim();
          if (!a.includes(tempEle)) {
            a.push(tempEle);
          }
        }
      }

      returnData["qualifications"] = a;
      returnData["num_companies"] = responses[8];
      res.send(returnData);
    })
    .catch((err) => {
      res.send({
        status: 400,
        message:
          err.message || "Some errors occurred while retrieving all posts.",
      });
    });
};
