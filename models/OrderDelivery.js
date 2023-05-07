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
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // NOTE: GET price from orderId ?
});

module.exports = OrderDelivery;
