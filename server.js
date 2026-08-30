const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {

        await sequelize.authenticate();

        console.log("MySQL database connected successfully.");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("Unable to connect to MySQL:", error.message);

    }

}

startServer();