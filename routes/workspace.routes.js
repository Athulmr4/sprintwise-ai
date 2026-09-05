const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { create, getAll, getOne, update } = require("../controllers/workspace.controller");
const { createWorkspaceValidator, updateWorkspaceValidator } = require("../validators/workspace.validator");
const {
    requireWorkspaceAdmin
} = require("../middleware/workspace.middleware");


const router = express.Router();

router.post(
    "/",
    authenticate,
    createWorkspaceValidator,
    validate,
    create
);

router.get("/", authenticate, getAll);

router.get("/:id", authenticate, getOne);

router.patch(
    "/:id",
    authenticate,
    requireWorkspaceAdmin,
    updateWorkspaceValidator,
    validate,
    update
);

module.exports = router;