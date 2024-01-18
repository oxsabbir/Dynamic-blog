const asyncHandler = function (incomingFunc) {
  return (req, res, next) => {
    incomingFunc(req, res, next).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
