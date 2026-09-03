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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
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

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({
        message: "Logout successful"
    });
};

module.exports = {
    register,login, logout
};