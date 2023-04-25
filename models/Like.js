const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Like = sequelize.define("Like", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Like;
