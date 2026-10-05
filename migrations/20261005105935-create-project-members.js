"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("project_members", {
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
                type: Sequelize.ENUM("owner", "manager", "member"),
                allowNull: false,
                defaultValue: "member"
            },

            joined_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });

        await queryInterface.addConstraint("project_members", {
            fields: ["project_id", "user_id"],
            type: "unique",
            name: "unique_project_member"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("project_members");
    }
};