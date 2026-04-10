const taskCreateValidator = (req, res, next) => {
  const { title } = req.body;
  const errors = {};

  if (!title) {
    errors.title = "Title is required";
  } else {
    if (title.length < 2) {
      errors.title = "Title must be at least 2 characters";
    }

    if (title.length > 50) {
      errors.title = "Title must be at most 50 characters";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ status: "error", error: errors });
  }

  next();
};

module.exports = taskCreateValidator;
