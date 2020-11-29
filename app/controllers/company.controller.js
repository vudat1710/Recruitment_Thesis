const db = require("../models");
const Company = db.Company;
const Op = db.Sequelize.Op;
const PostCompany = db.PostCompany;
const validateCompanyInput = require("../validation/company");

exports.addCompany = (req, res) => {
  const { errors, isValid } = validateCompanyInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name } = req.body;

  Company.findOne({ where: { name: name } })
    .then((m) => {
      if (m !== null) {
        return res.json({
          status: 400,
          errors: { name: "Công ty đã tồn tại trong hệ thống" },
        });
      } else {
        let conditions = {};
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
      res.send({
        status: 400,
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
  const { errors, isValid } = validateCompanyInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name, companyId } = req.body;

  Company.findOne({ where: { companyId: companyId } })
    .then((m) => {
      if (m !== null) {
        if (name === m.name) {
          m.update({
            name: req.body.name ? req.body.name : m.name,
            description: req.body.description
              ? req.body.description
              : m.description,
            address: req.body.address ? req.body.address : m.address,
            img_url: req.body.img_url ? req.body.img_url : m.img_url,
          });
          res.json({
            success: true,
            message: "Company is updated",
          });
        } else {
          Company.findOne({ where: { name: name } }).then((m2) => {
            if (m2 !== null) {
              return res.json({
                status: 400,
                errors: { name: "Công ty đã tồn tại trong hệ thống" },
              });
            } else {
              m.update({
                name: req.body.name ? req.body.name : m.name,
                description: req.body.description
                  ? req.body.description
                  : m.description,
                address: req.body.address ? req.body.address : m.address,
                img_url: req.body.img_url ? req.body.img_url : m.img_url,
              });
              res.json({
                success: true,
                message: "Company is updated",
              });
            }
          }).catch((err) => {
            res.send({
              status: 400,
              message: err.message || "Some errors occurred.",
            });
          });;
        }
      } else {
        res.json({
          status: 400,
          errors: { name: "Công ty không tồn tại trong hệ thống" },
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

exports.deleteCompany = (req, res) => {
  const { companyId } = req.body;

  Company.findOne({ where: { companyId: companyId } })
    .then((m) => {
      if (m) {
        const a = Company.destroy({ where: { companyId: m.companyId } });
        const b = PostCompany.destroy({ where: { companyId: m.companyId } });
        Promise.all([a, b])
          .then(() => {
            res.json({
              success: true,
              message: "Company is deleted",
            });
          })
          .catch((err) => {
            res.send({
              status: 400,
              message: err.message || "Some errors occurred.",
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
      res.send({
        status: 400,
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.searchCompanies = (req, res) => {
  let conditions = { where: { name: { [Op.like]: `%${req.body.name}%` } } };
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  conditions["limit"] = parseInt(size);
  conditions["offset"] = page || page !== 0 ? size * (page - 1) : 0;

  Company.findAll(conditions, { subQuery: false })
    .then((data) => {
      const companies = data;
      conditions["distinct"] = true;
      conditions["col"] = "companyId";
      Company.count(conditions, { subQuery: false })
        .then((totalItems) => {
          const currentPage = page ? page : 1;
          const totalPages = Math.ceil(totalItems / size);
          res.send({ totalItems, companies, currentPage, totalPages });
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
