const { registerUser } = require("../services/auth.service");

const register = async (req, res, next) => {

    try {

        const { name, email, password } = req.body;

        const user = await registerUser({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        next(error);

    }
};

module.exports = {
    register
};