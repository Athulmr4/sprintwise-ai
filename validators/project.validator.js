const { body } = require("express-validator");

const createProjectValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required")
        .isLength({ max: 150 })
        .withMessage("Project name must not exceed 150 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Project description must not exceed 2000 characters"),

    body("status")
        .optional()
        .isIn(["planned", "active", "completed", "archived"])
        .withMessage(
            "Status must be planned, active, completed, or archived"
        ),

    body("start_date")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Start date must be a valid date"),

    body("end_date")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("End date must be a valid date")
];

const updateProjectValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Project name cannot be empty")
        .isLength({ max: 150 })
        .withMessage("Project name must not exceed 150 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Project description must not exceed 2000 characters"),

    body("status")
        .optional()
        .isIn(["planned", "active", "completed", "archived"])
        .withMessage(
            "Status must be planned, active, completed, or archived"
        ),

    body("start_date")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Start date must be a valid date"),

    body("end_date")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("End date must be a valid date")
];

module.exports = {
    createProjectValidator,
    updateProjectValidator
};