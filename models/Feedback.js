const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  rate: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});

module.exports = Feedback;
