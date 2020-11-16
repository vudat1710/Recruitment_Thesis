/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Post', {
    postId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    extra_requirements: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    job_benefits: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    salary_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    min_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    job_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    num_hiring: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valid_through: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    post_url: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    qualification: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    contact_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Post',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
      {
        name: "postId_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
    ]
  });
};
