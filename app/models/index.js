const dbConfig = require("../configs/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.post = require("./post.model.js")(sequelize, Sequelize);
db.workplace = require("./workplace.model.js")(sequelize, Sequelize);
db.company = require("./company.model.js")(sequelize, Sequelize);
db.rate_post = require("./rate_post.model.js")(sequelize, Sequelize);
db.action = require("./action.model.js")(sequelize, Sequelize);
db.major = require("./major.model.js")(sequelize, Sequelize);
db.wppost = require("./wppost.model.js")(sequelize, Sequelize);
db.wpuser = require("./wpuser.model.js")(sequelize, Sequelize);
db.comment_post = require("./comment_post.model.js")(sequelize, Sequelize);
db.major_item = require("./major_item.model.js")(sequelize, Sequelize);
db.major_post = require("./major_post.model.js")(sequelize, Sequelize);
db.post_company = require("./post_company.model.js")(sequelize, Sequelize);
db.wishlist = require("./wishlist.model.js")(sequelize, Sequelize);
db.action_item = require("./action_item.model.js")(sequelize, Sequelize);

// Comment
db.user.hasMany(db.comment_post, { as: "comments" });
db.post.hasMany(db.comment_post, { as: "comments" });
db.comment_post.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});
db.comment_post.belongsTo(db.post, {
  foreignKey: "postId",
  as: "Post",
});

// Rate
db.user.hasMany(db.rate_post, { as: "rates" });
db.post.hasMany(db.rate_post, { as: "rates" });
db.rate_post.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});
db.rate_post.belongsTo(db.post, {
  foreignKey: "postId",
  as: "Post",
});

// WPUser, WPPost
db.user.hasMany(db.wpuser, { as: "workplaces" });
db.post.hasMany(db.wppost, { as: "workplaces" });
db.wpuser.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});
db.wppost.belongsTo(db.post, {
  foreignKey: "postId",
  as: "Post",
});

db.workplace.hasMany(db.wpuser, { as: "users" });
db.workplace.hasMany(db.wppost, { as: "posts" });
db.wpuser.belongsTo(db.workplace, {
  foreignKey: "workPlaceId",
  as: "WorkPlace",
});
db.wppost.belongsTo(db.workplace, {
  foreignKey: "workPlaceId",
  as: "WorkPlace",
});

// Action
db.user.hasMany(db.action_item, { as: "actions" });
db.action.hasMany(db.action_item, { as: "users" });
db.action_item.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});
db.action_item.belongsTo(db.action, {
  foreignKey: "actionTypeId",
  as: "ActionType",
});

// Wishlist
db.user.hasMany(db.wishlist, { as: "wishlist" });
db.post.hasMany(db.wishlist, { as: "wishlist" });
db.wishlist.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});
db.wishlist.belongsTo(db.post, {
  foreignKey: "postId",
  as: "Post",
});

// Major
db.user.hasMany(db.major_item, { as: "majors" });
db.major.hasMany(db.major_item, { as: "users" });
db.major_item.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});
db.major_item.belongsTo(db.major, {
  foreignKey: "majorId",
  as: "Major",
});

db.post.hasMany(db.major_post, { as: "majors" });
db.major.hasMany(db.major_post, { as: "posts" });
db.major_post.belongsTo(db.post, {
  foreignKey: "postId",
  as: "Post",
});
db.major_post.belongsTo(db.major, {
  foreignKey: "majorId",
  as: "Major",
});

// PostCompany
db.post.hasMany(db.post_company, { as: "companies" });
db.company.hasMany(db.post_company, { as: "posts" });
db.post_company.belongsTo(db.post, {
  foreignKey: "postId",
  as: "Post",
});
db.post_company.belongsTo(db.company, {
  foreignKey: "companyId",
  as: "Company",
});

module.exports = db;
