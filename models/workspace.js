const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Workspace = sequelize.define(
    "Workspace",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "workspaces",
        timestamps: false
    }
);

module.exports = Workspace;