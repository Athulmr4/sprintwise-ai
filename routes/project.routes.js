const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const {
    requireWorkspaceMember,
    requireWorkspaceAdmin
} = require("../middleware/workspace.middleware");

const {
    create,
    getAll,
    getOne,
    update,
    remove
} = require("../controllers/project.controller");

const {
    createProjectValidator,
    updateProjectValidator
} = require("../validators/project.validator");

const {
    requireProjectMember,
    requireProjectManager,
    requireProjectOwner
} = require("../middleware/project.middleware");

const router = express.Router();

router.post(
    "/workspaces/:workspaceId/projects",
    authenticate,
    requireWorkspaceAdmin,
    createProjectValidator,
    validate,
    create
);

router.get(
    "/workspaces/:workspaceId/projects",
    authenticate,
    requireWorkspaceMember,
    getAll
);

router.get(
    "/projects/:id",
    authenticate,
    requireProjectMember,
    getOne
);

router.patch(
    "/projects/:id",
    authenticate,
    requireProjectManager,
    updateProjectValidator,
    validate,
    update
);

router.delete(
    "/projects/:id",
    authenticate,
    requireProjectOwner,
    remove
);

module.exports = router;