/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MajorItem', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    majorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Major',
        key: 'majorId'
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
    tableName: 'MajorItem',
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
        name: "majorIdMajor_idx",
        using: "BTREE",
        fields: [
          { name: "majorId" },
        ]
      },
      {
        name: "userIdMajor_idx",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
