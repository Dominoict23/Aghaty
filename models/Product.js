const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  availableAmount: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  limitAmount: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  discountPrice: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  orderCount: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  rate: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});

module.exports = Product;
