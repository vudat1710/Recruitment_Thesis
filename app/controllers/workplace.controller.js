const db = require("../models");
const WorkPlace = db.WorkPlace;
const Op = db.Sequelize.Op;
const WorkPlacePost = db.WorkPlacePost;
const WorkPlaceUser = db.WorkPlaceUser;

exports.addWorkPlace = (req, res) => {
  const { workplace } = req.body;

  WorkPlace.findOne({ where: { name: workplace } })
    .then((m) => {
      if (m) {
        res.json({
          success: false,
          message: "Workplace is already in db",
        });
      } else {
        WorkPlace.create({ name: workplace })
          .then(() => {
            res.json({
              success: true,
              message: "Workplace added",
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

exports.getWorkPlaceById = (req, res) => {
  const { workPlaceId } = req.body;

  WorkPlace.findOne({ where: { workPlaceId: workPlaceId } })
    .then((m) => {
      res.send(m);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getWorkPlaceByName = (req, res) => {
  const { workplace } = req.body;

  WorkPlace.findOne({ where: { name: workplace } })
    .then((m) => {
      res.send(m);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.updateWorkPlace = (req, res) => {
  const { workplace, workPlaceId } = res.body;

  WorkPlace.findOne({ workPlaceId: workPlaceId })
    .then((m) => {
      if (m) {
        m.update({ name: workplace });
        res.json({
          success: true,
          message: "Workplace is updated",
        });
      } else {
        res.json({
          success: false,
          message: "Workplace does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.deleteWorkPlace = (req, res) => {
  const { workplace } = req.body;

  WorkPlace.findOne({ where: { name: workplace } })
    .then((m) => {
      if (m) {
        const a = WorkPlace.destroy({ workPlaceId: m.workPlaceId });
        const b = WorkPlaceUser.destroy({ workPlaceId: m.workPlaceId });
        const c = WorkPlacePost.destroy({ workPlaceId: m.workPlaceId });

        Promise.all([a, b, c]).then(() => {
          res.json({
            success: true,
            message: "Workplace is deleted",
          });
        });
      } else {
        res.json({
          success: false,
          message: "Workplace does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};