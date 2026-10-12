
"use strict";

const taskService = require("../services/task.service");

const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask({
    ...req.body,
    projectId: Number(req.params.projectId),
    creatorId: req.user.id
});

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

const getProjectTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getProjectTasks(
            Number(req.params.projectId),
            req.user.id
        );

        res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(
            Number(req.params.id),
            req.user.id
        );

        res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(
            Number(req.params.id),
            req.user.id,
            req.body
        );

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const result = await taskService.deleteTask(
            Number(req.params.id),
            req.user.id
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask
};
