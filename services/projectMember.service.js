const {
    Project,
    ProjectMember,
    WorkspaceMember,
    User
} = require("../models");

const AppError = require("../utils/appError");

const addProjectMember = async ({
    projectId,
    userId,
    role = "member"
}) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const workspaceMembership = await WorkspaceMember.findOne({
        where: {
            workspace_id: project.workspace_id,
            user_id: userId
        }
    });

    if (!workspaceMembership) {
        throw new AppError(
            "User must be a member of the workspace before joining this project",
            400
        );
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const existingMembership = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: userId
        }
    });

    if (existingMembership) {
        throw new AppError(
            "User is already a member of this project",
            409
        );
    }

    return ProjectMember.create({
        project_id: projectId,
        user_id: userId,
        role
    });
};

const getProjectMembers = async (projectId) => {
    const project = await Project.findByPk(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    return ProjectMember.findAll({
        where: {
            project_id: projectId
        },
        include: [
            {
                association: "user",
                attributes: [
                    "id",
                    "name",
                    "email",
                    "profile_image",
                    "status"
                ]
            }
        ],
        order: [["joined_at", "ASC"]]
    });
};


const updateProjectMemberRole = async ({
    projectId,
    userId,
    role
}) => {
    const membership = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: userId
        }
    });

    if (!membership) {
        throw new AppError(
            "Project member not found",
            404
        );
    }

    if (membership.role === "owner") {
        throw new AppError(
            "The project owner's role cannot be changed",
            403
        );
    }

    membership.role = role;

    await membership.save();

    return membership;
};


const removeProjectMember = async ({
    projectId,
    userId,
    requestingUserId
}) => {
    const membership = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: userId
        }
    });

    if (!membership) {
        throw new AppError(
            "Project member not found",
            404
        );
    }

    if (membership.role === "owner") {
        throw new AppError(
            "The project owner cannot be removed",
            403
        );
    }

    const requestingMembership = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: requestingUserId
        }
    });

    if (!requestingMembership) {
        throw new AppError("Project not found", 404);
    }

    if (
        requestingMembership.role === "manager" &&
        membership.role === "manager"
    ) {
        throw new AppError(
            "Managers cannot remove other managers",
            403
        );
    }

    await membership.destroy();

    return membership;
};


const leaveProject = async ({
    projectId,
    userId
}) => {
    const membership = await ProjectMember.findOne({
        where: {
            project_id: projectId,
            user_id: userId
        }
    });

    if (!membership) {
        throw new AppError(
            "Project membership not found",
            404
        );
    }

    if (membership.role === "owner") {
        throw new AppError(
            "The project owner cannot leave the project. Transfer ownership first.",
            403
        );
    }

    await membership.destroy();

    return membership;
};


const transferProjectOwnership = async ({
    projectId,
    currentOwnerId,
    newOwnerId
}) => {
    const transaction = await ProjectMember.sequelize.transaction();

    try {
        const currentOwner = await ProjectMember.findOne({
            where: {
                project_id: projectId,
                user_id: currentOwnerId,
                role: "owner"
            },
            transaction
        });

        if (!currentOwner) {
            throw new AppError(
                "Only the project owner can transfer ownership",
                403
            );
        }

        const newOwner = await ProjectMember.findOne({
            where: {
                project_id: projectId,
                user_id: newOwnerId
            },
            transaction
        });

        if (!newOwner) {
            throw new AppError(
                "The new owner must be a member of the project",
                400
            );
        }

        if (Number(currentOwnerId) === Number(newOwnerId)) {
            throw new AppError(
                "You are already the project owner",
                400
            );
        }

        newOwner.role = "owner";
        await newOwner.save({ transaction });

        currentOwner.role = "manager";
        await currentOwner.save({ transaction });

        await transaction.commit();

        return {
            previousOwner: currentOwner,
            newOwner
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    addProjectMember,
    getProjectMembers,
    updateProjectMemberRole,
    removeProjectMember,
    leaveProject,
    transferProjectOwnership
};