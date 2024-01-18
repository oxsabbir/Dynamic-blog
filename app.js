const express = require("express");
const blogRouter = require("./routes/blogRouter");
const errorController = require("./controller/errorController");
const userRouter = require("./routes/userRouter");

const app = express();

// body parser
app.use(express.json());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/user", userRouter);

// Grobal error handling middleware
app.use(errorController);
module.exports = app;
