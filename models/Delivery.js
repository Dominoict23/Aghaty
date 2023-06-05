const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Delivery = sequelize.define("Delivery", {
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
  firstName: {
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
    defaultValue: "free",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // NOTE:long, lat change based on firebase
  long: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  lat: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  verificationCode: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Delivery;
