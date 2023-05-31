const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  totalProductsPrice: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  deliveryPrice: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
});

module.exports = Cart;
