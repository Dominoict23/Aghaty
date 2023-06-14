const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const OrderPackage = sequelize.define("OrderPackage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // status: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderMobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverMobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  packageDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = OrderPackage;
