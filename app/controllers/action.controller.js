const db = require("../models");
const ActionType = db.ActionType;
const ActionTypeItem = db.ActionTypeItem;
const Op = db.Sequelize.Op;
const validateActionTypeInput = require("../validation/workPlaceMajor");

exports.getClick = (req, res) => {
  const { postId, userId, name } = req.body;

  ActionType.findOne({ where: { name: name } })
    .then((data) => {
      if (data !== null) {
        const actionTypeId = data.actionTypeId;
        ActionTypeItem.findOne({
          where: {
            postId: postId,
            userId: userId,
            actionTypeId: actionTypeId,
          },
        })
          .then((m) => {
            if (m !== null) {
              m.update({
                postId: postId,
                userId: userId,
                actionTypeId: actionTypeId,
                value: m.value + 1,
              })
                .then(() => {
                  res.json({
                    success: true,
                    message: "ActionType updated",
                  });
                })
                .catch((err) => {
                  res.send({
                    status: 400,
                    message: err.message || "Some errors occurred.",
                  });
                });
            } else {
              ActionTypeItem.create({
                postId: postId,
                userId: userId,
                actionTypeId: actionTypeId,
                value: 1,
              })
                .then(() => {
                  res.json({
                    success: true,
                    message: "ActionType added",
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
      }
    })
    .catch((err) => {
      res.send({
        status: 400,
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.addActionType = (req, res) => {
  const { errors, isValid } = validateActionTypeInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name } = req.body;

  ActionType.findOne({ where: { name: name } })
    .then((m) => {
      if (m) {
        return res.json({
          status: 400,
          errors: { name: "Hành động đã có trong CSDL" },
        });
      } else {
        ActionType.create({ name: name })
          .then(() => {
            res.json({
              success: true,
              message: "ActionType added",
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

exports.updateActionType = (req, res) => {
  const { errors, isValid } = validateActionTypeInput(req.body);
  if (!isValid) {
    return res.json({
      status: 400,
      errors,
    });
  }
  const { name, actionTypeId } = req.body;

  ActionType.findOne({ actionTypeId: actionTypeId })
    .then((m) => {
      if (m !== null) {
        if (name !== m.name) {
          ActionType.findOne({ where: { name: name } }).then((m2) => {
            if (m2 !== null) {
              return res.json({
                status: 400,
                errors: { name: "Hành động đã tồn tại trong CSDL" },
              });
            } else {
              m.update({ name: name });
              res.json({
                success: true,
                message: "ActionType is updated",
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
          errors: { name: "Hành động không tồn tại trong CSDL" },
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

exports.deleteActionType = (req, res) => {
  const { actionTypeId } = req.body;

  ActionType.findOne({ where: { actionTypeId: actionTypeId } })
    .then((m) => {
      if (m !== null) {
        const a = ActionType.destroy({
          where: { actionTypeId: m.actionTypeId },
        });
        const b = ActionTypeItem.destroy({
          where: { actionTypeId: m.actionTypeId },
        });

        Promise.all([a, b]).then(() => {
          res.json({
            success: true,
            message: "Action is deleted",
          });
        });
      } else {
        return res.json({
          status: 400,
          errors: { name: "Hành động không tồn tại trong CSDL" },
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred.",
      });
    });
};

exports.getActionTypeByName = (req, res) => {
  const { name } = req.body;
  const size = parseInt(req.body.size);
  const page = parseInt(req.body.page);

  if (name !== "") {
    ActionType.findOne({ where: { name: name } })
      .then((m) => {
        const actions = m !== null ? [m] : [];
        const totalPages = m !== null ? 1 : 0;
        const currentPage = 1;
        const totalItems = m !== null ? 1 : 0;
        res.send({ totalItems, actions, currentPage, totalPages });
      })
      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  } else {
    ActionType.findAndCountAll({
      limit: size,
      offset: page || page !== 0 ? size * (page - 1) : 0,
    })
      .then((m) => {
        const actions = m.rows;
        const totalItems = m.count;
        const totalPages = Math.ceil(totalItems / size);
        const currentPage = page ? page : 1;

        res.send({ totalItems, actions, currentPage, totalPages });
      })
      .catch((err) => {
        res.send({
          status: 400,
          message: err.message || "Some errors occurred.",
        });
      });
  }
};

exports.getActionTypeById = (req, res) => {
  const { actionTypeId } = req.body;

  ActionType.findOne({ where: { actionTypeId: actionTypeId } })
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
