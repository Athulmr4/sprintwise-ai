
"use strict";

const dashboardService = require("../services/dashboard.service");

const getSummary = async (req, res, next) => {
    try {
        const summary = await dashboardService.getDashboardSummary(
            req.user.id
        );

        return res.status(200).json({ summary });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSummary };
