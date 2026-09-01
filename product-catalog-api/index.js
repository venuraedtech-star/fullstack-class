// dotenv must load before anything else reads process.env. quiet: true
// suppresses its startup log line (which otherwise prints a random
// unsolicited "tip" ad for the maintainer's other projects on every boot).
require("dotenv").config({ quiet: true });

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware order matters — each request flows through these top to
// bottom: helmet() sets security-related response headers, cors() lets a
// browser on a different origin (e.g. the React dev server) actually read
// the response — origin: true (rather than the default *) reflects the
// request's real Origin back, which browsers require once credentials
// (cookies) are involved, since a wildcard origin can't be paired with
// credentials: true. morgan("dev") logs each request, express.json()
// parses a JSON request body into req.body, and cookieParser() parses the
// httpOnly refresh-token cookie into req.cookies. json/cookie parsing has
// to come before any route handler that reads req.body / req.cookies.
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Uploaded product images, served publicly. helmet's default
// Cross-Origin-Resource-Policy: same-origin would otherwise block the
// React frontend (a different origin/port) from actually loading these
// as <img> tags, so it's relaxed for just this path.
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads")),
);

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

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
