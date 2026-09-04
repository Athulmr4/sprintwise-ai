const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const workspaceRoutes = require("./routes/workspace.routes");
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
app.use(express.static("public"));
app.use(errorHandler);

app.get("/", (req, res) => {
    res.render("home", {
        title: "SprintWise AI"
    });
});

module.exports = app;