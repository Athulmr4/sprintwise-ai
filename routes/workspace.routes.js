const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { create, 
    getAll, 
    getOne, 
    update,
    remove,
    addMember,
    getMembers,
    updateMemberRole,
    removeMember,
    leave,
    transferOwnership } = require("../controllers/workspace.controller");

const { createWorkspaceValidator, 
    updateWorkspaceValidator,
    addMemberValidator,
    updateMemberRoleValidator,
    transferOwnershipValidator } = require("../validators/workspace.validator");
const {
    requireWorkspaceAdmin,
    requireWorkspaceOwner,
    requireWorkspaceMember,
    requireWorkspaceOwnerForRoleChange
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

router.delete(
    "/:id/leave",
    authenticate,
    leave
);

router.patch(
    "/:id/transfer-ownership",
    authenticate,
    transferOwnershipValidator,
    validate,
    transferOwnership
);

router.get(
    "/:id/members",
    authenticate,
    requireWorkspaceMember,
    getMembers
);

router.get("/:id", authenticate, getOne);

router.patch(
    "/:id/members/:userId",
    authenticate,
    updateMemberRoleValidator,
    validate,
    updateMemberRole
);

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

router.delete(
    "/:id/members/:userId",
    authenticate,
    requireWorkspaceAdmin,
    removeMember
);


module.exports = router;