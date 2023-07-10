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
  orderPrice: {
    type: DataTypes.DOUBLE,
  },
  deliveryPrice: {
    type: DataTypes.DOUBLE,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = Order;
