const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isLike: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasVideo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasLive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Post;
