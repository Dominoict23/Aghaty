const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const ServiceOrder = sequelize.define("ServiceOrder", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serviceDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ServiceOrder;
