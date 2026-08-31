"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },

            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            profile_image: {
                type: Sequelize.STRING(500),
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM("active", "inactive"),
                allowNull: false,
                defaultValue: "active"
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
        await queryInterface.dropTable("users");
    }
};