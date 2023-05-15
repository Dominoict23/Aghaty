const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    //ASK: 3 langs ?? i guess no from admin
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // NOTE: productSeller || serviceSeller
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Category;
