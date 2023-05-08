const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

dotenv.config();
const { NODE_ENV, DATABASE_URL, DEV_DATABASE_URL } = process.env;

// const sequelize = new Sequelize("aghaty", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
// });

const sequelize = new Sequelize(
  "globegki_aghaty",
  "globegki_root",
  "059283805928388",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
