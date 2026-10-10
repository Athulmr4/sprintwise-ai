const {
    addProjectMember,
    getProjectMembers,
    updateProjectMemberRole,
    removeProjectMember,
    leaveProject,
    transferProjectOwnership
} = require("../services/projectMember.service");


const addMember = async (req, res, next) => {
    try {
        const membership = await addProjectMember({
            projectId: req.params.id,
            userId: req.body.userId,
            role: req.body.role
        });

        return res.status(201).json({
            message: "Project member added successfully",
            membership
        });
    } catch (error) {
        next(error);
    }
};


const getMembers = async (req, res, next) => {
    try {
        const members = await getProjectMembers(
            req.params.id
        );

        return res.status(200).json({
            members
        });
    } catch (error) {
        next(error);
    }
};


const updateMemberRole = async (req, res, next) => {
    try {
        const membership = await updateProjectMemberRole({
            projectId: req.params.id,
            userId: req.params.userId,
            role: req.body.role
        });

        return res.status(200).json({
            message: "Project member role updated successfully",
            membership
        });
    } catch (error) {
        next(error);
    }
};


const removeMember = async (req, res, next) => {
    try {
        await removeProjectMember({
            projectId: req.params.id,
            userId: req.params.userId,
            requestingUserId: req.user.id
        });

        return res.status(200).json({
            message: "Project member removed successfully"
        });
    } catch (error) {
        next(error);
    }
};


const leave = async (req, res, next) => {
    try {
        await leaveProject({
            projectId: req.params.id,
            userId: req.user.id
        });

        return res.status(200).json({
            message: "You have left the project successfully"
        });
    } catch (error) {
        next(error);
    }
};


const transferOwnership = async (req, res, next) => {
    try {
        const result = await transferProjectOwnership({
            projectId: req.params.id,
            currentOwnerId: req.user.id,
            newOwnerId: req.body.userId
        });

        return res.status(200).json({
            message: "Project ownership transferred successfully",
            previousOwner: result.previousOwner,
            newOwner: result.newOwner
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    addMember,
    getMembers,
    updateMemberRole,
    removeMember,
    leave,
    transferOwnership
};