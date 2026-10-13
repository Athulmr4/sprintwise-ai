const errorHandler = require("./middleware/error.middleware");
const authenticatePage = require("./middleware/pageAuth.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const projectRoutes = require("./routes/project.routes");
const projectMemberRoutes = require("./routes/projectMember.routes");
const taskRoutes = require("./routes/task.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api", projectRoutes);
app.use("/api", projectMemberRoutes);
app.use("/api", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(express.static("public"));

app.get("/login", (req, res) => {
    res.render("login", { title: "Sign In | SprintWise AI" });
});

app.get("/dashboard", authenticatePage, (req, res) => {
    res.render("dashboard", { title: "Dashboard | SprintWise AI" });
});

app.use(errorHandler);

app.get("/", (req, res) => {
    res.render("home", {
        title: "SprintWise AI"
    });
});

module.exports = app;