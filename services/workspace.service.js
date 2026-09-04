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

module.exports = {
    createWorkspace
};