
"use strict";

const { Task, ProjectMember } = require("../models");
const AppError = require("../utils/appError");

const requireTaskProjectManager = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        const membership = await ProjectMember.findOne({
            where: {
                project_id: task.project_id,
                user_id: req.user.id
            }
        });

        if (!membership) {
            throw new AppError("Task not found", 404);
        }

        if (!["owner", "manager"].includes(membership.role)) {
            throw new AppError(
                "Only project owners and managers can delete tasks",
                403
            );
        }

        req.task = task;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { requireTaskProjectManager };
