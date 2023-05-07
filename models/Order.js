const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Order;
