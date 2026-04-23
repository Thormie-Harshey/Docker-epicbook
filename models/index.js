"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
let db = {};
let sequelize;

if (config.use_env_variable) {
  // Logic for when a single connection string like JAWSDB_URL is provided
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Modern DevOps logic: Use process.env variables mapped from your .env file
  sequelize = new Sequelize(
    process.env[config.username] || config.username,
    process.env[config.password] || config.password,
    process.env[config.database] || config.database,
    {
      host: process.env[config.host] || config.host,
      dialect: config.dialect || "mysql"
    }
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;