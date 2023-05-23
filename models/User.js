const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const User = sequelize.define("User", {
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
    defaultValue: "",
  },
  cover: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  verificationCode: {
    type: DataTypes.INTEGER,
  },
});

module.exports = User;
