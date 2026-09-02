const bcrypt = require("bcrypt");
const { User } = require("../models");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, email, password }) => {

    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new AppError(
            "Email is already registered",
            409
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
};

const loginUser = async ({ email, password }) => {

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    if (user.status !== "active") {
        throw new AppError(
            "Your account is inactive",
            403
        );
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const token = jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return {
        user,
        token
    };
};

module.exports = {
    registerUser, loginUser 
};