const {
    Project,
    ProjectMember
} = require("../models");

const createProject = async ({
    workspaceId,
    creatorId,
    name,
    description,
    status,
    start_date,
    end_date
}) => {
    const transaction = await Project.sequelize.transaction();

    try {
        const project = await Project.create(
            {
                workspace_id: workspaceId,
                name,
                description,
                status,
                start_date,
                end_date
            },
            { transaction }
        );

        await ProjectMember.create(
            {
                project_id: project.id,
                user_id: creatorId,
                role: "owner"
            },
            { transaction }
        );

        await transaction.commit();

        return project;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getWorkspaceProjects = async (workspaceId) => {
    return Project.findAll({
        where: {
            workspace_id: workspaceId
        },
        order: [["created_at", "DESC"]]
    });
};

const getProjectById = async (projectId) => {
    return Project.findByPk(projectId);
};

const updateProject = async (
    projectId,
    {
        name,
        description,
        status,
        start_date,
        end_date
    }
) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        return null;
    }

    if (name !== undefined) {
        project.name = name;
    }

    if (description !== undefined) {
        project.description = description;
    }

    if (status !== undefined) {
        project.status = status;
    }

    if (start_date !== undefined) {
        project.start_date = start_date;
    }

    if (end_date !== undefined) {
        project.end_date = end_date;
    }

    await project.save();

    return project;
};

const deleteProject = async (projectId) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        return null;
    }

    await project.destroy();

    return project;
};

module.exports = {
    createProject,
    getWorkspaceProjects,
    getProjectById,
    updateProject,
    deleteProject
};