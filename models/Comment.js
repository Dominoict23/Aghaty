const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Comment;
