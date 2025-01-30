const Sequelize = require("sequelize");

const sequelize = new Sequelize("safebox", "root", "root", {
  host: "localhost",
  dialect: "sqlite",
});

module.exports = sequelize;
