const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Live = sequelize.define("Live", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roomID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Live;
