const bcrypt = require("bcrypt");
const { User } = require("../models");
const AppError = require("../utils/appError");

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

module.exports = {
    registerUser
};