const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Starting the server

dotenv.config({ path: "./conf.env" });

const app = require("./app");
// connecting to the data base

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DATABASE CONNECTION STABLISHED"));

// Exposing the application to the port
const port = process.env.PORT;
app.listen(port, "127.0.0.1", () => console.log(`Listening at Port : ${port}`));
