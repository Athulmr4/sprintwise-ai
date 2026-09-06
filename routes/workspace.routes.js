const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { create, getAll, getOne, update,remove,addMember } = require("../controllers/workspace.controller");
const { createWorkspaceValidator, updateWorkspaceValidator,addMemberValidator } = require("../validators/workspace.validator");
const {
    requireWorkspaceAdmin,
    requireWorkspaceOwner
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

router.delete(
    "/:id",
    authenticate,
    requireWorkspaceOwner,
    remove
);

router.post(
    "/:id/members",
    authenticate,
    requireWorkspaceAdmin,
    addMemberValidator,
    validate,
    addMember
);

module.exports = router;