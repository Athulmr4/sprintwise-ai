"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("projects", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            workspace_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "workspaces",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            name: {
                type: Sequelize.STRING(150),
                allowNull: false
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM(
                    "planned",
                    "active",
                    "completed",
                    "archived"
                ),
                allowNull: false,
                defaultValue: "planned"
            },

            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },

            end_date: {
                type: Sequelize.DATEONLY,
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
    },

    async down(queryInterface) {
        await queryInterface.dropTable("projects");
    }
};