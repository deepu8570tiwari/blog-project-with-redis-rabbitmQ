const tryCatch = (controllerFn) => {
  return async (req, res, next) => {
    try {
      // optional logging
      // console.log("Authenticated User:", req.user?._id);
      await controllerFn(req, res, next);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };
};

module.exports = { tryCatch };
