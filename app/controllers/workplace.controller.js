const db = require("../models");
const WorkPlace = db.WorkPlace;
const Op = db.Sequelize.Op;
const WorkPlacePost = db.WorkPlacePost;
const WorkPlaceUser = db.WorkPlaceUser;
const validateWorkPlaceMajorInput = require("../validation/workPlaceMajor");

exports.addWorkPlace = (req, res) => {
  const { errors, isValid } = validateWorkPlaceMajorInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name } = req.body;

  WorkPlace.findOne({ where: { name: name } })
    .then((m) => {
      if (m) {
        return res.json({
          status: 400,
          errors: { name: "Địa điểm làm việc đã có trong CSDL" },
        });
      } else {
        WorkPlace.create({ name: name })
          .then(() => {
            res.json({
              success: true,
              message: "Workplace added",
            });
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

exports.getWorkPlaceById = (req, res) => {
  const { workPlaceId } = req.body;

  WorkPlace.findOne({ where: { workPlaceId: workPlaceId } })
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

exports.getWorkPlaceByName = (req, res) => {
  const { name } = req.body;
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  if (name !== "") {
    WorkPlace.findOne({ where: { name: name } })
      .then((m) => {
        const workPlaces = m !== null ? [m] : [];
        const totalPages = m !== null ? 1 : 0;
        const currentPage = 1;
        const totalItems = m !== null ? 1 : 0;
        res.send({ totalItems, workPlaces, currentPage, totalPages });
      })
      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  } else {
    WorkPlace.findAndCountAll({
      limit: size,
      offset: page || page !== 0 ? size * (page - 1) : 0,
    })
      .then((m) => {
        const workPlaces = m.rows;
        const totalItems = m.count;
        const totalPages = Math.ceil(totalItems / size);
        const currentPage = page ? page : 1;

        res.send({ totalItems, workPlaces, currentPage, totalPages });
      })
      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  }
};

exports.updateWorkPlace = (req, res) => {
  const { errors, isValid } = validateWorkPlaceMajorInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name, workPlaceId } = req.body;

  WorkPlace.findOne({ workPlaceId: workPlaceId })
    .then((m) => {
      if (m !== null) {
        if (name !== m.name) {
          WorkPlace.findOne({ where: { name: name } }).then((m2) => {
            if (m2 !== null) {
              return res.json({
                status: 400,
                errors: { name: "Địa điểm làm việc đã tồn tại trong CSDL" },
              });
            } else {
              m.update({ name: name });
              res.json({
                success: true,
                message: "Workplace is updated",
              });
            }
          });
        } else {
          return res.json({
            status: 400,
            errors: { name: "Hãy điền vào thông tin mới" },
          });
        }
      } else {
        return res.json({
          status: 400,
          errors: { name: "Địa điểm làm việc không tồn tại trong CSDL" },
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

exports.deleteWorkPlace = (req, res) => {
  const { workPlaceId } = req.body;

  WorkPlace.findOne({ where: { workPlaceId: workPlaceId } })
    .then((m) => {
      if (m !== null) {
        const a = WorkPlace.destroy({ where: {workPlaceId: m.workPlaceId} });
        const b = WorkPlaceUser.destroy({ where: {workPlaceId: m.workPlaceId} });
        const c = WorkPlacePost.destroy({ where: {workPlaceId: m.workPlaceId} });

        Promise.all([a, b, c]).then(() => {
          res.json({
            success: true,
            message: "Workplace is deleted",
          });
        });
      } else {
        return res.json({
          status: 400,
          errors: { name: "Địa điểm làm việc không tồn tại trong CSDL" },
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};
