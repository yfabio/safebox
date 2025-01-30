const Sequelize = require("sequelize");

const sequelize = require("../sqlite/db");

const Key = sequelize.define("key", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    length: 40,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    length: 40,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    length: 120,
  },
});
