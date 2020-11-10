/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Major', {
    majorId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: "name_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Major',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "majorId" },
        ]
      },
      {
        name: "majorId_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "majorId" },
        ]
      },
      {
        name: "name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
