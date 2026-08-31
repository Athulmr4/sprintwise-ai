const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use(express.static("public"));
app.use(errorHandler);

app.get("/", (req, res) => {
    res.render("home", {
        title: "SprintWise AI"
    });
});

module.exports = app;