
"use strict";

const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get(
    "/summary",
    authenticate,
    dashboardController.getSummary
);

router.get(
    "/analytics",
    authenticate,
    dashboardController.getTaskAnalytics
);

router.get(
    "/recent-projects",
    authenticate,
    dashboardController.getRecentProjects
);

module.exports = router;
