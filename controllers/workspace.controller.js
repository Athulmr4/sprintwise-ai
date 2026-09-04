const { createWorkspace } = require("../services/workspace.service");

const create = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const workspace = await createWorkspace({
            name,
            description,
            ownerId: req.user.id
        });

        res.status(201).json({
            message: "Workspace created successfully",
            workspace: {
                id: workspace.id,
                name: workspace.name,
                description: workspace.description,
                owner_id: workspace.owner_id
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create
};