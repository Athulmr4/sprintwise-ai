const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const {
    addMember,
    getMembers,
    updateMemberRole,
    removeMember,
    leave,
    transferOwnership
} = require("../controllers/projectMember.controller");

const {
    addProjectMemberValidator,
    updateProjectMemberRoleValidator,
    transferProjectOwnershipValidator
} = require("../validators/projectMember.validator");

const {
    requireProjectMember,
    requireProjectManager,
    requireProjectOwner
} = require("../middleware/project.middleware");

const router = express.Router();


router.get(
    "/projects/:id/members",
    authenticate,
    requireProjectMember,
    getMembers
);


router.post(
    "/projects/:id/members",
    authenticate,
    requireProjectManager,
    addProjectMemberValidator,
    validate,
    addMember
);


router.patch(
    "/projects/:id/members/:userId",
    authenticate,
    requireProjectOwner,
    updateProjectMemberRoleValidator,
    validate,
    updateMemberRole
);


router.delete(
    "/projects/:id/members/:userId",
    authenticate,
    requireProjectManager,
    removeMember
);


router.delete(
    "/projects/:id/leave",
    authenticate,
    requireProjectMember,
    leave
);


router.patch(
    "/projects/:id/transfer-ownership",
    authenticate,
    requireProjectOwner,
    transferProjectOwnershipValidator,
    validate,
    transferOwnership
);


module.exports = router;