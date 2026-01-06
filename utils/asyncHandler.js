// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     return await fn(req, res, next);
//   } catch (error) {
//     res.status(error.status || 500).json({
//       message: error.message || "request failed",
//       success: false,
//     });
//   }
// };

const asyncHandler = (requestHandler) => (req, res, next) => {
  return Promise.resolve(requestHandler(req, res, next)).catch((error) => {
    console.log("error to get function", error);
    next(error);
  });
};

export { asyncHandler };

