
"use strict";

const { body, param } = require("express-validator");

const taskIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Task ID must be a positive integer")
];

const projectIdValidator = [
    param("projectId")
        .isInt({ min: 1 })
        .withMessage("Project ID must be a positive integer")
];

const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required")
        .bail()
        .isLength({ max: 200 })
        .withMessage("Task title cannot exceed 200 characters"),

    body("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string"),

    body("status")
        .optional()
        .isIn(["todo", "in_progress", "in_review", "completed"])
        .withMessage("Invalid task status"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high", "urgent"])
        .withMessage("Invalid task priority"),

    body("assigned_to")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Assignee ID must be a positive integer"),

    body("parent_task_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Parent task ID must be a positive integer"),

    body("start_date")
        .optional({ nullable: true })
        .isISO8601({ strict: true })
        .withMessage("Start date must use YYYY-MM-DD format"),

    body("due_date")
        .optional({ nullable: true })
        .isISO8601({ strict: true })
        .withMessage("Due date must use YYYY-MM-DD format"),

    body("estimated_hours")
        .optional({ nullable: true })
        .isFloat({ min: 0, max: 9999.99 })
        .withMessage("Estimated hours must be between 0 and 9999.99")
];

const updateTaskValidator = [
    ...taskIdValidator,

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Task title cannot be empty")
        .bail()
        .isLength({ max: 200 })
        .withMessage("Task title cannot exceed 200 characters"),

    body("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string"),

    body("status")
        .optional()
        .isIn(["todo", "in_progress", "in_review", "completed"])
        .withMessage("Invalid task status"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high", "urgent"])
        .withMessage("Invalid task priority"),

    body("assigned_to")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Assignee ID must be a positive integer"),

    body("parent_task_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Parent task ID must be a positive integer"),

    body("start_date")
        .optional({ nullable: true })
        .isISO8601({ strict: true })
        .withMessage("Start date must use YYYY-MM-DD format"),

    body("due_date")
        .optional({ nullable: true })
        .isISO8601({ strict: true })
        .withMessage("Due date must use YYYY-MM-DD format"),

    body("estimated_hours")
        .optional({ nullable: true })
        .isFloat({ min: 0, max: 9999.99 })
        .withMessage("Estimated hours must be between 0 and 9999.99")
];

module.exports = {
    taskIdValidator,
    projectIdValidator,
    createTaskValidator,
    updateTaskValidator
};
