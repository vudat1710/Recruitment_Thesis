const db = require("../models");
const Major = db.Major;
const Op = db.Sequelize.Op;
const MajorPost = db.MajorPost;
const MajorItem = db.MajorItem;
const validateWorkPlaceMajorInput = require("../validation/workPlaceMajor");

exports.addMajor = (req, res) => {
  const { errors, isValid } = validateWorkPlaceMajorInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name } = req.body;

  Major.findOne({ where: { name: name } })
    .then((m) => {
      if (m) {
        return res.json({
          status: 400,
          errors: { name: "Ngành nghề đã có trong CSDL" },
        });
      } else {
        Major.create({ name: name })
          .then(() => {
            res.json({
              success: true,
              message: "Major added",
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

exports.getMajorById = (req, res) => {
  const { majorId } = req.body;

  Major.findOne({ where: { majorId: majorId } })
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

exports.getMajorByName = (req, res) => {
  const { name } = req.body;
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  if (name !== "") {
    Major.findOne({ where: { name: name } })
      .then((m) => {
        const majors = m !== null ? [m] : [];
        const totalPages = m !== null ? 1 : 0;
        const currentPage = 1;
        const totalItems = m !== null ? 1 : 0;
        res.send({ totalItems, majors, currentPage, totalPages });
      })
      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  } else {
    Major.findAndCountAll({
      limit: size,
      offset: page || page !== 0 ? size * (page - 1) : 0,
    })
      .then((m) => {
        const majors = m.rows;
        const totalItems = m.count;
        const totalPages = Math.ceil(totalItems / size);
        const currentPage = page ? page : 1;

        res.send({ totalItems, majors, currentPage, totalPages });
      })
      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  }
};

exports.updateMajor = (req, res) => {
  const { errors, isValid } = validateWorkPlaceMajorInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name, majorId } = req.body;

  Major.findOne({ majorId: majorId })
    .then((m) => {
      if (m !== null) {
        if (name !== m.name) {
          Major.findOne({ where: { name: name } }).then((m2) => {
            if (m2 !== null) {
              return res.json({
                status: 400,
                errors: { name: "Ngành nghề đã tồn tại trong CSDL" },
              });
            } else {
              m.update({ name: name });
              res.json({
                success: true,
                message: "Major is updated",
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
          errors: { name: "Ngành nghề không tồn tại trong CSDL" },
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

exports.deleteMajor = (req, res) => {
  const { majorId } = req.body;

  Major.findOne({ where: { majorId: majorId } })
    .then((m) => {
      if (m !== null) {
        const a = Major.destroy({ where: {majorId: m.majorId} });
        const b = MajorItem.destroy({ where: {majorId: m.majorId} });
        const c = MajorPost.destroy({ where: {majorId: m.majorId} });

        Promise.all([a, b, c]).then(() => {
          res.json({
            success: true,
            message: "Major is deleted",
          });
        });
      } else {
        return res.json({
          status: 400,
          errors: { name: "Ngành nghề không tồn tại trong CSDL" },
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
