const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Service = sequelize.define("Service", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priceFrom: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  priceTo: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});

module.exports = Service;
