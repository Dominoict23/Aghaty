const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Seller = sequelize.define("Seller", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firsName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    default: "free",
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationCode: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Seller;
