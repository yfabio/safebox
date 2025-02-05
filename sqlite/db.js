const { Sequelize } = require("sequelize");

const path = require("path");
const os = require("os");

const dbFile = path.join(os.homedir(), "safebox", "safebox.db");

const sequelize = new Sequelize({
  database: "safebox",
  storage: dbFile,
  dialect: "sqlite",
});

module.exports = sequelize;
