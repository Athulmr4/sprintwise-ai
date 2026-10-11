
"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Task extends Model {}

    Task.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            parent_task_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            title: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM(
                    "todo",
                    "in_progress",
                    "in_review",
                    "completed"
                ),
                allowNull: false,
                defaultValue: "todo"
            },
            priority: {
                type: DataTypes.ENUM(
                    "low",
                    "medium",
                    "high",
                    "urgent"
                ),
                allowNull: false,
                defaultValue: "medium"
            },
            assigned_to: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            estimated_hours: {
                type: DataTypes.DECIMAL(6, 2),
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Task",
            tableName: "tasks",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Task;
};
