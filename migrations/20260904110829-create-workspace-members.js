"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("workspace_members", {
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

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            role: {
                type: Sequelize.ENUM("owner", "admin", "member"),
                allowNull: false,
                defaultValue: "member"
            },

            joined_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });

        await queryInterface.addConstraint("workspace_members", {
            fields: ["workspace_id", "user_id"],
            type: "unique",
            name: "unique_workspace_member"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("workspace_members");
    }
};