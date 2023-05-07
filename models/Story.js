const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Story = sequelize.define("Story", {
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

module.exports = Story;
