
"use strict";

const {
    Task,
    Project,
    ProjectMember,
    User
} = require("../models");

const AppError = require("../utils/appError");

const ensureProjectMember = async (projectId, userId) => {
    const membership = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: userId
        }
    });

    if (!membership) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    return membership;
};

const createTask = async ({
    projectId,
    creatorId,
    title,
    description,
    status,
    priority,
    assigned_to,
    parent_task_id,
    start_date,
    due_date,
    estimated_hours
}) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    await ensureProjectMember(projectId, creatorId);

    if (assigned_to != null) {
        await ensureProjectMember(projectId, assigned_to);

        const assignee = await User.findByPk(assigned_to);

        if (!assignee) {
            throw new AppError("Assignee not found", 404);
        }
    }

    if (parent_task_id != null) {
        const parentTask = await Task.findOne({
            where: {
                id: parent_task_id,
                project_id: projectId
            }
        });

        if (!parentTask) {
            throw new AppError(
                "Parent task not found in this project",
                404
            );
        }
    }

    return Task.create({
        project_id: projectId,
        created_by: creatorId,
        title,
        description,
        status,
        priority,
        assigned_to,
        parent_task_id,
        start_date,
        due_date,
        estimated_hours
    });
};

const getProjectTasks = async (projectId, userId) => {
    await ensureProjectMember(projectId, userId);

    return Task.findAll({
        where: { project_id: projectId },
        order: [["created_at", "DESC"]]
    });
};

const getTaskById = async (taskId, userId) => {
    const task = await Task.findByPk(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    await ensureProjectMember(task.project_id, userId);

    return task;
};

const updateTask = async (taskId, userId, updates) => {
    const task = await Task.findByPk(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    await ensureProjectMember(task.project_id, userId);

    if (
        updates.assigned_to !== undefined &&
        updates.assigned_to !== null
    ) {
        await ensureProjectMember(
            task.project_id,
            updates.assigned_to
        );

        const assignee = await User.findByPk(
            updates.assigned_to
        );

        if (!assignee) {
            throw new AppError("Assignee not found", 404);
        }
    }

    if (updates.parent_task_id != null) {
        const parentTask = await Task.findOne({
            where: {
                id: updates.parent_task_id,
                project_id: task.project_id
            }
        });

        if (!parentTask) {
            throw new AppError(
                "Parent task not found in this project",
                404
            );
        }

        if (Number(updates.parent_task_id) === task.id) {
            throw new AppError(
                "A task cannot be its own parent",
                400
            );
        }
    }

    const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "assigned_to",
    "parent_task_id",
    "start_date",
    "due_date",
    "estimated_hours"
];

const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) =>
        allowedFields.includes(key)
    )
);

await task.update(safeUpdates);

    return task;
};

const deleteTask = async (taskId, userId) => {
    const task = await Task.findByPk(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    await ensureProjectMember(task.project_id, userId);

    await task.destroy();

    return { message: "Task deleted successfully" };
};

module.exports = {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask
};
