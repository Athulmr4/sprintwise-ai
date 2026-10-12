
"use strict";

const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const {
    requireProjectMember,
    requireProjectManager
} = require("../middleware/project.middleware");

const validate = require("../middleware/validation.middleware");

const {
    requireTaskProjectManager
} = require("../middleware/task.middleware");

const {
    projectIdValidator,
    taskIdValidator,
    createTaskValidator,
    updateTaskValidator
} = require("../validators/task.validator");

const taskController = require("../controllers/task.controller");

// Create a task in a project
router.post(
    "/projects/:projectId/tasks",
    authenticate,
    requireProjectMember,
    projectIdValidator,
    validate,
    createTaskValidator,
    validate,
    taskController.createTask
);

// List tasks in a project
router.get(
    "/projects/:projectId/tasks",
    authenticate,
    requireProjectMember,
    projectIdValidator,
    validate,
    taskController.getProjectTasks
);

// Get one task
router.get(
    "/tasks/:id",
    authenticate,
    taskIdValidator,
    validate,
    taskController.getTaskById
);

// Update a task
router.patch(
    "/tasks/:id",
    authenticate,
    taskIdValidator,
    updateTaskValidator,
    validate,
    taskController.updateTask
);

// Delete a task: owner or manager only
router.delete(
    "/tasks/:id",
    authenticate,
    taskIdValidator,
    validate,
    requireTaskProjectManager,
    taskController.deleteTask
);

module.exports = router;
