const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const OrderFromTo = sequelize.define("OrderFromTo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locationFrom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locationTo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = OrderFromTo;
