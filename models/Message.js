const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  msgBody: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Message;
