const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const CartProduct = sequelize.define("CartProduct", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = CartProduct;
