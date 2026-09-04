const sequelize = require("../config/db");
const User = require("./user");
const Workspace = require("./workspace");
const WorkspaceMember = require("./workspaceMember");

// User owns workspaces
User.hasMany(Workspace, {
    foreignKey: "owner_id",
    as: "ownedWorkspaces"
});

Workspace.belongsTo(User, {
    foreignKey: "owner_id",
    as: "owner"
});

// Workspace membership
User.hasMany(WorkspaceMember, {
    foreignKey: "user_id",
    as: "workspaceMemberships"
});

WorkspaceMember.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Workspace.hasMany(WorkspaceMember, {
    foreignKey: "workspace_id",
    as: "memberships"
});

WorkspaceMember.belongsTo(Workspace, {
    foreignKey: "workspace_id",
    as: "workspace"
});

const db = {
    sequelize,
    User,
    Workspace,
    WorkspaceMember
};

module.exports = db;