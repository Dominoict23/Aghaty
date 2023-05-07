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
    defaultValue: 0,
  },
  deliveryPrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = FinancialRecord;
