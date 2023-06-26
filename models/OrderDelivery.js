const { DataTypes } = require("sequelize");
const sequelize = require("../db/config/connection");

const OrderDelivery = sequelize.define("OrderDelivery", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  startLat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  startLong: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  endLat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  endLong: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  rejectedDeliveries: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
    get() {
      const rawValue = this.getDataValue("rejectedDeliveries");
      return rawValue ? rawValue.split(",") : [];
    },
    set(value) {
      if (Array.isArray(value)) {
        const stringValue = value.join(",");
        this.setDataValue("rejectedDeliveries", stringValue);
      }
    },
  },
});

module.exports = OrderDelivery;
