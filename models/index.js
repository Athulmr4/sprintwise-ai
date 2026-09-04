const sequelize = require("../config/db");
const User = require("./user");
const Workspace = require("./workspace");

const db = {
    sequelize,
    User,
    Workspace
};

module.exports = db;