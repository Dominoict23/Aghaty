const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Location = sequelize.define("Location", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // NOTE: buildNumber is string because we can't put a default value if it was integer && mobile doesn't accept null
  buildNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Location;
