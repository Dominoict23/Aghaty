const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const FinancialRecord = sequelize.define("FinancialRecord", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = FinancialRecord;
