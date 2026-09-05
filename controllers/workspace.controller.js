const {
    createWorkspace,
    getUserWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
} = require("../services/workspace.service");

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

const getAll = async (req, res, next) => {
    try {
        const memberships = await getUserWorkspaces(req.user.id);

        const workspaces = memberships.map((membership) => ({
            id: membership.workspace.id,
            name: membership.workspace.name,
            description: membership.workspace.description,
            owner_id: membership.workspace.owner_id,
            role: membership.role,
            created_at: membership.workspace.created_at,
            updated_at: membership.workspace.updated_at
        }));

        res.status(200).json({
            workspaces
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const membership = await getWorkspaceById(
            req.params.id,
            req.user.id
        );

        if (!membership) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        res.status(200).json({
            workspace: {
                id: membership.workspace.id,
                name: membership.workspace.name,
                description: membership.workspace.description,
                owner_id: membership.workspace.owner_id,
                role: membership.role,
                created_at: membership.workspace.created_at,
                updated_at: membership.workspace.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const workspace = await updateWorkspace(
            req.params.id,
            { name, description }
        );

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        res.status(200).json({
            message: "Workspace updated successfully",
            workspace: {
                id: workspace.id,
                name: workspace.name,
                description: workspace.description,
                owner_id: workspace.owner_id,
                updated_at: workspace.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const workspace = await deleteWorkspace(req.params.id);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        res.status(200).json({
            message: "Workspace deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove
};