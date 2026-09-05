const { body } = require("express-validator");

const createWorkspaceValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Workspace name is required")
        .isLength({ max: 150 })
        .withMessage("Workspace name must not exceed 150 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Workspace description must not exceed 1000 characters")
];

const updateWorkspaceValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Workspace name cannot be empty")
        .isLength({ max: 150 })
        .withMessage("Workspace name must not exceed 150 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Workspace description must not exceed 1000 characters")
];

module.exports = {
    createWorkspaceValidator,
    updateWorkspaceValidator
};