const express = require("express");
const router = express.Router();

const { createOrder, getAllOrders } = require("../controllers/orderController");
const validateOrder = require("../middleware/validateOrder");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Any authenticated user can place their own order; only admins can list all orders.
router.post("/", authenticate, validateOrder, createOrder);
router.get("/", authenticate, authorize("admin"), getAllOrders);

module.exports = router;
