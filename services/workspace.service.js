const { Workspace, WorkspaceMember, User } = require("../models");
const AppError = require("../utils/appError");

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

const addWorkspaceMember = async ({
    workspaceId,
    email,
    role = "member"
}) => {
    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const existingMembership = await WorkspaceMember.findOne({
        where: {
            workspace_id: workspaceId,
            user_id: user.id
        }
    });

    if (existingMembership) {
        throw new AppError(
            "User is already a member of this workspace",
            409
        );
    }

    const membership = await WorkspaceMember.create({
        workspace_id: workspaceId,
        user_id: user.id,
        role
    });

    return membership;
};

module.exports = {
    createWorkspace,
    getUserWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace,
    addWorkspaceMember
};