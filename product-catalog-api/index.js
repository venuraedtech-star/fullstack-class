// dotenv must load before anything else reads process.env. quiet: true
// suppresses its startup log line (which otherwise prints a random
// unsolicited "tip" ad for the maintainer's other projects on every boot).
require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware order matters — each request flows through these top to
// bottom: helmet() sets security-related response headers, cors() lets a
// browser on a different origin (e.g. the React dev server on :5173)
// actually read the response, morgan("dev") logs each request, and
// express.json() parses a JSON request body into req.body. That last one
// has to come before any route handler that reads req.body.
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);

// Catch-all — anything that didn't match a route above. Must come after
// all real routes, since Express tries them in registration order.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Must be the very last app.use() — see middleware/errorHandler.js.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`product-catalog-api listening at http://localhost:${PORT}`);
});
