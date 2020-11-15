/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    userId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    experience: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    qualification: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    year_of_birth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    job_type: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    salary: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    is_lock: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'User',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "userId_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
