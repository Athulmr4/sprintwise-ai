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
    getOne
);

router.patch(
    "/projects/:id",
    authenticate,
    updateProjectValidator,
    validate,
    update
);

router.delete(
    "/projects/:id",
    authenticate,
    remove
);

module.exports = router;