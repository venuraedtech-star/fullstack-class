// Express recognizes this as an error handler because it takes 4 arguments
// (err, req, res, next) — that signature is how it's told apart from
// normal middleware. Only reached when a route's catch block calls
// next(err); must be the very last app.use() in index.js.
function errorHandler(err, req, res, next) {
  // Multer errors (file too large, wrong field, etc.) and this app's own
  // image-only fileFilter rejection (see middleware/upload.js) are really
  // a 400 — invalid client input — not a 500.
  if (err.name === "MulterError" || err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
