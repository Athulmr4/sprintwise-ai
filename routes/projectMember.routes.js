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


const router = express.Router();


router.get(
    "/projects/:id/members",
    authenticate,
    getMembers
);


router.post(
    "/projects/:id/members",
    authenticate,
    addProjectMemberValidator,
    validate,
    addMember
);


router.patch(
    "/projects/:id/members/:userId",
    authenticate,
    updateProjectMemberRoleValidator,
    validate,
    updateMemberRole
);


router.delete(
    "/projects/:id/members/:userId",
    authenticate,
    removeMember
);


router.delete(
    "/projects/:id/leave",
    authenticate,
    leave
);


router.patch(
    "/projects/:id/transfer-ownership",
    authenticate,
    transferProjectOwnershipValidator,
    validate,
    transferOwnership
);


module.exports = router;