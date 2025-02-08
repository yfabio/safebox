const { DataTypes } = require("sequelize");

const sequelize = require("../sqlite/db");

const Session = sequelize.define("session", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Session;
