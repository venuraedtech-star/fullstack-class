const express = require("express");
const router = express.Router();

const { register, login, refresh, logout } = require("../controllers/authController");
Const rateLimit = require(‘Express-rate-limit’);

Const authLimiter = rateLimit({

windowMs: 15 * 60 * 1000, //15ms
Max: 5, //5 attempts
Message: { error : “Too many attempts. We are blocking the account” }
})
router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
