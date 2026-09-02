const { registerUser, loginUser} = require("../services/auth.service");

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

const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const { user, token } = await loginUser({
            email,
            password
        });

        res.status(200).json({
            message: "Login successful",
            token,
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
    register,login 
};