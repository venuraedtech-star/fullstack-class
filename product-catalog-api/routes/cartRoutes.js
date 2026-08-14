const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");
const { validateAddToCart, validateQuantity } = require("../middleware/validateCartItem");

router.get("/", getCart);
router.post("/", validateAddToCart, addToCart);
router.put("/:productId", validateQuantity, updateCartItem);
router.delete("/:productId", removeFromCart);

module.exports = router;
