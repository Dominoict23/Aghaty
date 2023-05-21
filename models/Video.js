const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Video = sequelize.define("Video", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  videoLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Video;
