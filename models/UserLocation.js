const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const UserLocation = sequelize.define("UserLocation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = UserLocation;
