/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WorkPlacePost', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'postId'
      }
    },
    workPlaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'WorkPlace',
        key: 'workPlaceId'
      }
    }
  }, {
    sequelize,
    tableName: 'WorkPlacePost',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "postId_idx",
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
      {
        name: "workPlaceId_idx",
        using: "BTREE",
        fields: [
          { name: "workPlaceId" },
        ]
      },
    ]
  });
};
