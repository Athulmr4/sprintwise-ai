const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const authenticate = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(
                "Authentication required",
                401
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.userId
        };

        next();

    } catch (error) {

        if (error.name === "JsonWebTokenError") {
            return next(
                new AppError("Invalid authentication token", 401)
            );
        }

        if (error.name === "TokenExpiredError") {
            return next(
                new AppError("Authentication token has expired", 401)
            );
        }

        next(error);
    }
};

module.exports = authenticate;