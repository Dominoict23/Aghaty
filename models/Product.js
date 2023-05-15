const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nameAR: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameEN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameKUR: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  availableAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  limitAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  discountPrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  orderCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rate: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Product;
