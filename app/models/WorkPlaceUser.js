/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WorkPlaceUser', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    workPlaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'WorkPlace',
        key: 'workPlaceId'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userId'
      }
    }
  }, {
    sequelize,
    tableName: 'WorkPlaceUser',
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
        name: "workPlaceIdUser_idx",
        using: "BTREE",
        fields: [
          { name: "workPlaceId" },
        ]
      },
      {
        name: "userIdWP_idx",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
