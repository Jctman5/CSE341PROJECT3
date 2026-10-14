require("dotenv").config();
const app = require("./app");
const mongodb = require("./data/database");
const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => console.log(`Running on port ${port}`));
    }
});