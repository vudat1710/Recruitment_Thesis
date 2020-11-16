const db = require("../models");
const Company = db.Company;
const Op = db.Sequelize.Op;
const PostCompany = db.PostCompany;

exports.addCompany = (req, res) => {
  const { name } = req.body;

  Major.findOne({ where: { name: name } })
    .then((m) => {
      if (m) {
        res.json({
          success: false,
          message: "Company is already in db",
        });
      } else {
        let conditions = {}
        for (key in req.body) {
            conditions[key] = req.body[key];
        }

        Company.create(conditions)
          .then(() => {
            res.json({
              success: true,
              message: "Company added",
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some errors occurred.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getCompanyById = (req, res) => {
  const { companyId } = req.body;

  Company.findOne({ where: { companyId: companyId } })
    .then((m) => {
      res.send(m);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getCompanyByName = (req, res) => {
  const { name } = req.body;

  Company.findOne({ where: { name: name } })
    .then((m) => {
      res.send(m);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.updateCompany = (req, res) => {
  const { companyId } = res.body;

  Company.findOne({ companyId: companyId })
    .then((m) => {
      if (m) {
        m.update({
            name: req.body.name ? req.body.name : m.name,
            description: req.body.description ? req.body.description : m.description,
            address: req.body.address ? req.body.address : m.address,
            img_url: req.body.img_url ? req.body.img_url : m.img_url,
        });
        res.json({
          success: true,
          message: "Company is updated",
        });
      } else {
        res.json({
          success: false,
          message: "Company does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.deleteCompany = (req, res) => {
  const { companyId } = req.body;

  Company.findOne({ where: { companyId: companyId } })
    .then((m) => {
      if (m) {
        const a = Company.destroy({ companyId: m.companyId });
        const b = PostCompany.destroy({ companyId: m.companyId });

        Promise.all([a, b]).then(() => {
          res.json({
            success: true,
            message: "Company is deleted",
          });
        });
      } else {
        res.json({
          success: false,
          message: "Company does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};
