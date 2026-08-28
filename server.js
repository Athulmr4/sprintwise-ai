const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SprintWise AI server running on http://localhost:${PORT}`);
});