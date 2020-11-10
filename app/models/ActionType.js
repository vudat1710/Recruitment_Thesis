/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ActionType', {
    actionTypeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ActionType',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "actionTypeId" },
        ]
      },
      {
        name: "actionTypeId_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "actionTypeId" },
        ]
      },
    ]
  });
};
