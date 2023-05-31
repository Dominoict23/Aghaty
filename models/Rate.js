const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Rate = sequelize.define("Rate", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rate: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
});

module.exports = Rate;
