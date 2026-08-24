const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { register, login, refresh, logout } = require("../controllers/authController");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
