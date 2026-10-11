const sequelize = require("../config/db");
const User = require("./user");
const Workspace = require("./workspace");
const WorkspaceMember = require("./workspaceMember");
const Project = require("./project");
const ProjectMember = require("./projectMember");
const Task = require("./task")(sequelize);

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

Workspace.hasMany(Project, {
    foreignKey: "workspace_id",
    as: "projects"
});

Project.belongsTo(Workspace, {
    foreignKey: "workspace_id",
    as: "workspace"
});

Project.hasMany(ProjectMember, {
    foreignKey: "project_id",
    as: "memberships"
});

ProjectMember.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project"
});

User.hasMany(ProjectMember, {
    foreignKey: "user_id",
    as: "projectMemberships"
});

ProjectMember.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Project.hasMany(Task, {
    foreignKey: "project_id",
    as: "tasks"
});

Task.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project"
});

User.hasMany(Task, {
    foreignKey: "assigned_to",
    as: "assignedTasks"
});

Task.belongsTo(User, {
    foreignKey: "assigned_to",
    as: "assignee"
});

User.hasMany(Task, {
    foreignKey: "created_by",
    as: "createdTasks"
});

Task.belongsTo(User, {
    foreignKey: "created_by",
    as: "creator"
});

Task.belongsTo(Task, {
    foreignKey: "parent_task_id",
    as: "parentTask"
});

Task.hasMany(Task, {
    foreignKey: "parent_task_id",
    as: "subtasks"
});

const db = {
    sequelize,
    User,
    Workspace,
    WorkspaceMember,
    Project,
    ProjectMember,
    Task 
};

module.exports = db;