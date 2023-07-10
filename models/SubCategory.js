const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const SubCategory = sequelize.define("SubCategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nameEN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameAR: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameKUR: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryPrice: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = SubCategory;
