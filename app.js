const express = require("express");
const blogRouter = require("./routes/blogRouter");
const errorController = require("./controller/errorController");

const app = express();

// body parser
app.use(express.json());

app.use("/api/v1/blogs", blogRouter);

// Grobal error handling middleware
app.use(errorController);
module.exports = app;
