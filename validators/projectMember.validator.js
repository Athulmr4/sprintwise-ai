const { body } = require("express-validator");

const addProjectMemberValidator = [
    body("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isInt({ min: 1 })
        .withMessage("User ID must be a valid user ID"),

    body("role")
        .optional()
        .isIn(["manager", "member"])
        .withMessage("Role must be either manager or member")
];


const updateProjectMemberRoleValidator = [
    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["manager", "member"])
        .withMessage("Role must be either manager or member")
];


const transferProjectOwnershipValidator = [
    body("userId")
        .notEmpty()
        .withMessage("New owner user ID is required")
        .isInt({ min: 1 })
        .withMessage("New owner user ID must be a valid user ID")
];


module.exports = {
    addProjectMemberValidator,
    updateProjectMemberRoleValidator,
    transferProjectOwnershipValidator
};