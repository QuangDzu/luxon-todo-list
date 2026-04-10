const jsonMiddleware = (req, _, next) => {
  let body = "";
  req.on("data", (buffer) => {
    body += buffer.toString();
  });
  req.on("end", () => {
    if (body.trim()) {
      try {
        req.body = JSON.parse(body);
      } catch (error) {
        console.error("JSON parse error:", error.message);
        req.body = {};
      }
    } else {
      req.body = {};
    }
    next();
  });
};

module.exports = jsonMiddleware;
