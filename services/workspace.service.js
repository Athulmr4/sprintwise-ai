const { Workspace, WorkspaceMember } = require("../models");

const createWorkspace = async ({ name, description, ownerId }) => {
    const transaction = await Workspace.sequelize.transaction();

    try {
        const workspace = await Workspace.create(
            {
                name,
                description,
                owner_id: ownerId
            },
            { transaction }
        );

        await WorkspaceMember.create(
            {
                workspace_id: workspace.id,
                user_id: ownerId,
                role: "owner"
            },
            { transaction }
        );

        await transaction.commit();

        return workspace;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getUserWorkspaces = async (userId) => {
    const memberships = await WorkspaceMember.findAll({
        where: {
            user_id: userId
        },
        include: [
            {
                association: "workspace",
                attributes: [
                    "id",
                    "name",
                    "description",
                    "owner_id",
                    "created_at",
                    "updated_at"
                ]
            }
        ],
        order: [["joined_at", "DESC"]]
    });

    return memberships;
};

const getWorkspaceById = async (workspaceId, userId) => {
    const membership = await WorkspaceMember.findOne({
        where: {
            workspace_id: workspaceId,
            user_id: userId
        },
        include: [
            {
                association: "workspace",
                attributes: [
                    "id",
                    "name",
                    "description",
                    "owner_id",
                    "created_at",
                    "updated_at"
                ]
            }
        ]
    });

    if (!membership) {
        return null;
    }

    return membership;
};

const updateWorkspace = async (
    workspaceId,
    { name, description }
) => {
    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
        return null;
    }

    if (name !== undefined) {
        workspace.name = name;
    }

    if (description !== undefined) {
        workspace.description = description;
    }

    await workspace.save();

    return workspace;
};

const deleteWorkspace = async (workspaceId) => {
    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
        return null;
    }

    await workspace.destroy();

    return workspace;
};

module.exports = {
    createWorkspace,
    getUserWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
};