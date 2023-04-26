const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});

module.exports = Cart;
