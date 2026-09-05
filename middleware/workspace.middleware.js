const { WorkspaceMember } = require("../models");
const AppError = require("../utils/appError");

const requireWorkspaceAdmin = async (req, res, next) => {
    try {
        const membership = await WorkspaceMember.findOne({
            where: {
                workspace_id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!membership) {
            throw new AppError("Workspace not found", 404);
        }

        if (!["owner", "admin"].includes(membership.role)) {
            throw new AppError(
                "You do not have permission to modify this workspace",
                403
            );
        }

        req.workspaceMembership = membership;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requireWorkspaceAdmin
};