const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const OrderDelivery = sequelize.define("OrderDelivery", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  startLat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  startLong: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  endLat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  endLong: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = OrderDelivery;
