const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { create } = require("../controllers/workspace.controller");
const { createWorkspaceValidator } = require("../validators/workspace.validator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    createWorkspaceValidator,
    validate,
    create
);

module.exports = router;