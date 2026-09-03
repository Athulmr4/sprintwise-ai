const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/me", authenticate, (req, res) => {

    res.status(200).json({
        message: "Authentication successful",
        userId: req.user.id
    });

});

module.exports = router;