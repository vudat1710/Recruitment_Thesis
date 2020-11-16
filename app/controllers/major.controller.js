const db = require("../models");
const Major = db.Major;
const Op = db.Sequelize.Op;
const MajorPost = db.MajorPost;
const MajorItem = db.MajorItem;

exports.addMajor = (req, res) => {
  const { major } = req.body;

  Major.findOne({ where: { name: major } })
    .then((m) => {
      if (m) {
        res.json({
          success: false,
          message: "Major is already in db",
        });
      } else {
        Major.create({ name: major })
          .then(() => {
            res.json({
              success: true,
              message: "Major added",
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

exports.getMajorById = (req, res) => {
  const { majorId } = req.body;

  Major.findOne({ where: { majorId: majorId } })
    .then((m) => {
      res.send(m);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getMajorByName = (req, res) => {
  const { major } = req.body;

  Major.findOne({ where: { name: major } })
    .then((m) => {
      res.send(m);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.updateMajor = (req, res) => {
  const { major, majorId } = res.body;

  Major.findOne({ majorId: majorId })
    .then((m) => {
      if (m) {
        m.update({ name: major });
        res.json({
          success: true,
          message: "Major is updated",
        });
      } else {
        res.json({
          success: false,
          message: "Major does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.deleteMajor = (req, res) => {
  const { major } = req.body;

  Major.findOne({ where: { name: major } })
    .then((m) => {
      if (m) {
        const a = Major.destroy({ majorId: m.majorId });
        const b = MajorItem.destroy({ majorId: m.majorId });
        const c = MajorPost.destroy({ majorId: m.majorId });

        Promise.all([a, b, c]).then(() => {
          res.json({
            success: true,
            message: "Major is deleted",
          });
        });
      } else {
        res.json({
          success: false,
          message: "Major does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};
