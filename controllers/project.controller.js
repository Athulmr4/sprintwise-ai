const {
    createProject,
    getWorkspaceProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../services/project.service");

const create = async (req, res, next) => {
    try {
        const {
            name,
            description,
            status,
            start_date,
            end_date
        } = req.body;

        const project = await createProject({
            workspaceId: req.params.workspaceId,
            creatorId: req.user.id,
            name,
            description,
            status,
            start_date,
            end_date
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const projects = await getWorkspaceProjects(
            req.params.workspaceId
        );

        return res.status(200).json({
            projects
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const project = await getProjectById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            project
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const {
            name,
            description,
            status,
            start_date,
            end_date
        } = req.body;

        const project = await updateProject(
            req.params.id,
            {
                name,
                description,
                status,
                start_date,
                end_date
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const project = await deleteProject(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project deleted successfully"
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