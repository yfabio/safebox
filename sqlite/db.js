const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: "safebox",
  storage: "safebox.db",
  dialect: "sqlite",
});

module.exports = sequelize;
