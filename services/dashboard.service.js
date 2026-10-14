
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


const getRecentProjects = async (userId) => {
    // Find projects that this user is a member of.
    const memberships = await ProjectMember.findAll({
        attributes: ["project_id"],
        where: { user_id: userId },
        raw: true
    });

    const projectIds = [
        ...new Set(memberships.map((item) => item.project_id))
    ];

    // Return an empty list if the user has no projects.
    if (projectIds.length === 0) {
        return [];
    }

    // Fetch the six most recently created projects and their tasks.
    const projects = await Project.findAll({
        where: {
            id: { [Op.in]: projectIds }
        },
        attributes: [
            "id",
            "name",
            "description",
            "status",
            "start_date",
            "end_date",
            "created_at"
        ],
        include: [
            {
                model: Task,
                as: "tasks",
                attributes: ["id", "status"]
            }
        ],
        order: [["created_at", "DESC"]],
        limit: 6
    });

    // Calculate task counts and completion percentage per project.
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return projects.map((project) => {
        const tasks = project.tasks || [];
        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            (task) => task.status === "completed"
        ).length;

        const completionRate = totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        let daysRemaining = null;
        let isOverdue = false;

        if (project.end_date) {
            // Compare date-only values to avoid timezone differences.
            const deadline = new Date(`${project.end_date}T00:00:00`);
            const millisecondsPerDay = 24 * 60 * 60 * 1000;

            daysRemaining = Math.round(
                (deadline.getTime() - today.getTime()) /
                millisecondsPerDay
            );

            isOverdue =
                daysRemaining < 0 &&
                !["completed", "archived"].includes(project.status);
        }

        return {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            start_date: project.start_date,
            end_date: project.end_date,
            totalTasks,
            completedTasks,
            completionRate,
            daysRemaining,
            isOverdue
        };
    });

};


module.exports = { getDashboardSummary, getRecentProjects};
