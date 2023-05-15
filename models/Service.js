const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Service = sequelize.define("Service", {
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
  priceFrom: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  priceTo: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Service;
