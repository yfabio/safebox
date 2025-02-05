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
  },
  {
    timestamps: false,
  }
);

module.exports = Person;
