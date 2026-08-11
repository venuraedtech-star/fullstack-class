// Express recognizes this as an error handler because it takes 4 arguments
// (err, req, res, next) — that signature is how it's told apart from
// normal middleware. Only reached when a route's catch block calls
// next(err); must be the very last app.use() in index.js.
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
