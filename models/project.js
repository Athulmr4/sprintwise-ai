const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Project = sequelize.define(
    "Project",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        workspace_id: {
            type: DataTypes.INTEGER,
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

        status: {
            type: DataTypes.ENUM(
                "planned",
                "active",
                "completed",
                "archived"
            ),
            allowNull: false,
            defaultValue: "planned"
        },

        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
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
        tableName: "projects",
        timestamps: false
    }
);

module.exports = Project;