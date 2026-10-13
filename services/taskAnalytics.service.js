
"use strict";

const { Op, fn, col } = require("sequelize");
const { ProjectMember, Task } = require("../models");

const getTaskAnalytics = async (userId) => {
    const memberships = await ProjectMember.findAll({
        attributes: ["project_id"],
        where: { user_id: userId },
        raw: true
    });

    const projectIds = [
        ...new Set(memberships.map((item) => item.project_id))
    ];

    const byStatus = {
        todo: 0,
        in_progress: 0,
        in_review: 0,
        completed: 0
    };

    const byPriority = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
    };

    if (projectIds.length === 0) {
        return {
            totalTasks: 0,
            byStatus,
            byPriority,
            completionRate: 0
        };
    }

    const statusRows = await Task.findAll({
        where: {
            project_id: { [Op.in]: projectIds }
        },
        attributes: [
            "status",
            [fn("COUNT", col("id")), "count"]
        ],
        group: ["status"],
        raw: true
    });

    for (const row of statusRows) {
        byStatus[row.status] = Number(row.count);
    }

    const priorityRows = await Task.findAll({
        where: {
            project_id: { [Op.in]: projectIds }
        },
        attributes: [
            "priority",
            [fn("COUNT", col("id")), "count"]
        ],
        group: ["priority"],
        raw: true
    });

    for (const row of priorityRows) {
        byPriority[row.priority] = Number(row.count);
    }

    const totalTasks = Object.values(byStatus)
        .reduce((sum, count) => sum + count, 0);

    const completionRate = totalTasks === 0
        ? 0
        : Math.round((byStatus.completed / totalTasks) * 100);

    return {
        totalTasks,
        byStatus,
        byPriority,
        completionRate
    };
};

module.exports = { getTaskAnalytics };
