const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const FinancialRecord = sequelize.define("FinancialRecord", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderPrice: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  deliveryPrice: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});

module.exports = FinancialRecord;
