const express = require("express");

const { register } = require("../controllers/auth.controller");
const { registerValidator } = require("../validators/auth.validator");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

module.exports = router;