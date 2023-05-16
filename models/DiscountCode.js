const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const DiscountCode = sequelize.define("DiscountCode", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  isEnable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = DiscountCode;
