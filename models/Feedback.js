const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  isLike: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rate: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
});

module.exports = Feedback;
