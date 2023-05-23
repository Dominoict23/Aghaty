const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const Seller = sequelize.define("Seller", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  cover: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "free",
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //NOTE: rate in seller calculated from table feedback using seller id
  rate: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  verificationCode: {
    type: DataTypes.INTEGER,
  },
  subCategories: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    get() {
      const rawValue = this.getDataValue("subCategories");
      return rawValue ? rawValue.split(",") : [];
    },
    set(value) {
      if (Array.isArray(value)) {
        const stringValue = value.join(",");
        this.setDataValue("subCategories", stringValue);
      }
    },
  },
});

module.exports = Seller;
