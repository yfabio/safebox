const { DataTypes } = require("sequelize");

const sequelize = require("../sqlite/db");

const Person = sequelize.define(
  "person",
  {
    id: {
      type: DataTypes.INTEGER,
      autoImcrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    picture: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Person;
