
"use strict";

const { Op, fn, col } = require("sequelize");
const { ProjectMember, Project, Task } = require("../models");

const getDashboardSummary = async (userId) => {
    const memberships = await ProjectMember.findAll({
        attributes: ["project_id"],
        where: { user_id: userId },
        raw: true
    });

    const projectIds = [
        ...new Set(memberships.map((item) => item.project_id))
    ];

    const projectCounts = {
        total: 0,
        planned: 0,
        active: 0,
        completed: 0,
        archived: 0
    };

    const taskCounts = {
        total: 0,
        todo: 0,
        in_progress: 0,
        in_review: 0,
        completed: 0
    };

    if (projectIds.length === 0) {
        return {
            projects: projectCounts,
            tasks: taskCounts,
            overdueTasks: 0,
            completionRate: 0
        };
    }

    const projectRows = await Project.findAll({
        where: { id: { [Op.in]: projectIds } },
        attributes: [
            "status",
            [fn("COUNT", col("id")), "count"]
        ],
        group: ["status"],
        raw: true
    });

    for (const row of projectRows) {
        projectCounts[row.status] = Number(row.count);
    }

    projectCounts.total = Object.entries(projectCounts)
        .filter(([key]) => key !== "total")
        .reduce((sum, [, count]) => sum + count, 0);

    const taskRows = await Task.findAll({
        where: { project_id: { [Op.in]: projectIds } },
        attributes: [
            "status",
            [fn("COUNT", col("id")), "count"]
        ],
        group: ["status"],
        raw: true
    });

    for (const row of taskRows) {
        taskCounts[row.status] = Number(row.count);
    }

    taskCounts.total = Object.entries(taskCounts)
        .filter(([key]) => key !== "total")
        .reduce((sum, [, count]) => sum + count, 0);

    const now = new Date();
    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    const overdueTasks = await Task.count({
        where: {
            project_id: { [Op.in]: projectIds },
            due_date: { [Op.lt]: today },
            status: { [Op.ne]: "completed" }
        }
    });

    const completionRate = taskCounts.total === 0
        ? 0
        : Math.round(
            (taskCounts.completed / taskCounts.total) * 100
        );

    return {
        projects: projectCounts,
        tasks: taskCounts,
        overdueTasks,
        completionRate
    };
};

module.exports = { getDashboardSummary };
