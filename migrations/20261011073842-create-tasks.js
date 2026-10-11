
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("tasks", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            project_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "projects",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            parent_task_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "tasks",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            title: {
                type: Sequelize.STRING(200),
                allowNull: false
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM(
                    "todo",
                    "in_progress",
                    "in_review",
                    "completed"
                ),
                allowNull: false,
                defaultValue: "todo"
            },

            priority: {
                type: Sequelize.ENUM(
                    "low",
                    "medium",
                    "high",
                    "urgent"
                ),
                allowNull: false,
                defaultValue: "medium"
            },

            assigned_to: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },

            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },

            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },

            estimated_hours: {
                type: Sequelize.DECIMAL(6, 2),
                allowNull: true
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });

        await queryInterface.addIndex("tasks", ["project_id"]);
        await queryInterface.addIndex("tasks", ["assigned_to"]);
        await queryInterface.addIndex("tasks", ["status"]);
        await queryInterface.addIndex("tasks", ["parent_task_id"]);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("tasks");
    }
};
