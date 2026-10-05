const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectMember = sequelize.define(
    "ProjectMember",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM("owner", "manager", "member"),
            allowNull: false,
            defaultValue: "member"
        },

        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "project_members",
        timestamps: false
    }
);

module.exports = ProjectMember;