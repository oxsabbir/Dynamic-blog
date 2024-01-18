const sendDevelopmentError = function (err, req, res) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });

  console.log("ERROR🔥", err);
};

const sendProductionError = function (err, req, res) {};

const errorController = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendDevelopmentError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendProductionError(err, req, res);
  }
};

module.exports = errorController;
