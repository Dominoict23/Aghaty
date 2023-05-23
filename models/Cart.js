const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Cart;
