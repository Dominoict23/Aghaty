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
    defaultValue: "avatar.png",
  },
  cover: {
    type: DataTypes.STRING,
    defaultValue: "cover.jpg",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "free",
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING,
  },
  //ASK: is it location or long and lat
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //ASK: rate in seller calculated from table feedback using seller id
  rate: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  verificationCode: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Seller;
