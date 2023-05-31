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
    defaultValue: "PENDING",
  },
  day: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Order;
