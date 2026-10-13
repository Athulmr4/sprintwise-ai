
"use strict";

const authenticate = require("./auth.middleware");

const authenticatePage = (req, res, next) => {
    authenticate(req, res, (error) => {
        if (error) {
            return res.redirect("/login");
        }

        next();
    });
};

module.exports = authenticatePage;
