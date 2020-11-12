var DataTypes = require("sequelize").DataTypes;
var _ActionType = require("./ActionType");
var _ActionTypeItem = require("./ActionTypeItem");
var _CommentPost = require("./CommentPost");
var _Company = require("./Company");
var _Major = require("./Major");
var _MajorItem = require("./MajorItem");
var _MajorPost = require("./MajorPost");
var _Post = require("./Post");
var _PostCompany = require("./PostCompany");
var _RatePost = require("./RatePost");
var _User = require("./User");
var _WishList = require("./WishList");
var _WorkPlace = require("./WorkPlace");
var _WorkPlacePost = require("./WorkPlacePost");
var _WorkPlaceUser = require("./WorkPlaceUser");

function initModels(sequelize, Sequelize) {
  var ActionType = _ActionType(sequelize, DataTypes);
  var ActionTypeItem = _ActionTypeItem(sequelize, DataTypes);
  var CommentPost = _CommentPost(sequelize, DataTypes);
  var Company = _Company(sequelize, DataTypes);
  var Major = _Major(sequelize, DataTypes);
  var MajorItem = _MajorItem(sequelize, DataTypes);
  var MajorPost = _MajorPost(sequelize, DataTypes);
  var Post = _Post(sequelize, DataTypes);
  var PostCompany = _PostCompany(sequelize, DataTypes);
  var RatePost = _RatePost(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var WishList = _WishList(sequelize, DataTypes);
  var WorkPlace = _WorkPlace(sequelize, DataTypes);
  var WorkPlacePost = _WorkPlacePost(sequelize, DataTypes);
  var WorkPlaceUser = _WorkPlaceUser(sequelize, DataTypes);
  var sequelize = sequelize
  var Sequelize = Sequelize

  ActionTypeItem.belongsTo(ActionType, { foreignKey: "actionTypeId"});
  ActionType.hasMany(ActionTypeItem, { foreignKey: "actionTypeId"});
  ActionTypeItem.belongsTo(User, { foreignKey: "userId"});
  User.hasMany(ActionTypeItem, { foreignKey: "userId"});
  CommentPost.belongsTo(Post, { foreignKey: "postId"});
  Post.hasMany(CommentPost, { foreignKey: "postId"});
  CommentPost.belongsTo(User, { foreignKey: "userId"});
  User.hasMany(CommentPost, { foreignKey: "userId"});
  MajorItem.belongsTo(Major, { foreignKey: "majorId"});
  Major.hasMany(MajorItem, { foreignKey: "majorId"});
  MajorItem.belongsTo(User, { foreignKey: "userId"});
  User.hasMany(MajorItem, { foreignKey: "userId"});
  MajorPost.belongsTo(Major, { foreignKey: "majorId"});
  Major.hasMany(MajorPost, { foreignKey: "majorId"});
  MajorPost.belongsTo(Post, { foreignKey: "postId"});
  Post.hasMany(MajorPost, { foreignKey: "postId"});
  PostCompany.belongsTo(Company, { foreignKey: "companyId"});
  Company.hasMany(PostCompany, { foreignKey: "companyId"});
  PostCompany.belongsTo(Post, { foreignKey: "postId"});
  Post.hasMany(PostCompany, { foreignKey: "postId"});
  RatePost.belongsTo(Post, { foreignKey: "postId"});
  Post.hasMany(RatePost, { foreignKey: "postId"});
  RatePost.belongsTo(User, { foreignKey: "userId"});
  User.hasMany(RatePost, { foreignKey: "userId"});
  WishList.belongsTo(Post, { foreignKey: "postId"});
  Post.hasMany(WishList, { foreignKey: "postId"});
  WishList.belongsTo(User, { foreignKey: "userId"});
  User.hasMany(WishList, { foreignKey: "userId"});
  WorkPlacePost.belongsTo(Post, { foreignKey: "postId"});
  Post.hasMany(WorkPlacePost, { foreignKey: "postId"});
  WorkPlacePost.belongsTo(WorkPlace, { foreignKey: "workPlaceId"});
  WorkPlace.hasMany(WorkPlacePost, { foreignKey: "workPlaceId"});
  WorkPlaceUser.belongsTo(User, { foreignKey: "userId"});
  User.hasMany(WorkPlaceUser, { foreignKey: "userId"});
  WorkPlaceUser.belongsTo(WorkPlace, { foreignKey: "workPlaceId"});
  WorkPlace.hasMany(WorkPlaceUser, { foreignKey: "workPlaceId"});
  
  Post.belongsToMany(WorkPlace, { through: WorkPlacePost, foreignKey: 'postId' });
  WorkPlace.belongsToMany(Post, { through: WorkPlacePost, foreignKey: 'workPlaceId' });
  User.belongsToMany(WorkPlace, { through: WorkPlaceUser, foreignKey: 'userId' });
  WorkPlace.belongsToMany(User, { through: WorkPlaceUser, foreignKey: 'workPlaceId' });
  Post.belongsToMany(Major, { through: MajorPost, foreignKey: 'postId' });
  Major.belongsToMany(Post, { through: MajorPost, foreignKey: 'majorId' });
  User.belongsToMany(Major, { through: MajorItem, foreignKey: 'userId' });
  Major.belongsToMany(User, { through: MajorItem, foreignKey: 'majorId' });
  User.belongsToMany(ActionType, { through: ActionTypeItem, foreignKey: 'userId' });
  ActionType.belongsToMany(User, { through: ActionTypeItem, foreignKey: 'actionTypeId' });
  Post.belongsToMany(Company, { through: PostCompany, foreignKey: 'postId' });
  Company.belongsToMany(Post, { through: PostCompany, foreignKey: 'companyId' });

  return {
    ActionType,
    ActionTypeItem,
    CommentPost,
    Company,
    Major,
    MajorItem,
    MajorPost,
    Post,
    PostCompany,
    RatePost,
    User,
    WishList,
    WorkPlace,
    WorkPlacePost,
    WorkPlaceUser,
    sequelize,
    Sequelize
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
