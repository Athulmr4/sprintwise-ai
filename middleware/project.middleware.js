const { Project, ProjectMember } = require("../models");
const AppError = require("../utils/appError");

const loadProjectMembership = async (req) => {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const membership = await ProjectMember.findOne({
        where: {
            project_id: project.id,
            user_id: req.user.id
        }
    });

    if (!membership) {
        throw new AppError("Project not found", 404);
    }

    req.project = project;
    req.projectMembership = membership;

    return membership;
};


const requireProjectMember = async (req, res, next) => {
    try {
        await loadProjectMembership(req);

        next();
    } catch (error) {
        next(error);
    }
};


const requireProjectManager = async (req, res, next) => {
    try {
        const membership = await loadProjectMembership(req);

        if (!["owner", "manager"].includes(membership.role)) {
            throw new AppError(
                "You do not have permission to perform this action",
                403
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};


const requireProjectOwner = async (req, res, next) => {
    try {
        const membership = await loadProjectMembership(req);

        if (membership.role !== "owner") {
            throw new AppError(
                "Only the project owner can perform this action",
                403
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};


module.exports = {
    requireProjectMember,
    requireProjectManager,
    requireProjectOwner
};