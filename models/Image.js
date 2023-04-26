const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Image = sequelize.define("Image", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Image;
