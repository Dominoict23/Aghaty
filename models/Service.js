const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Service = sequelize.define("Service", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  //ASK: name in 3 languages ?
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
    defaultValue: 0,
  },
  priceTo: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Service;
