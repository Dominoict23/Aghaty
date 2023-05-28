const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const OrderProduct = sequelize.define("OrderProduct", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = OrderProduct;
