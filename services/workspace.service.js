const { Workspace } = require("../models");

const createWorkspace = async ({ name, description, ownerId }) => {
    const workspace = await Workspace.create({
        name,
        description,
        owner_id: ownerId
    });

    return workspace;
};

module.exports = {
    createWorkspace
};