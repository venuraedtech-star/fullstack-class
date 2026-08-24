// Route-to-controller mapping only — no logic lives here.
const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const validateProduct = require("../middleware/validateProduct");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorize("admin"), validateProduct, createProduct);
router.put("/:id", authenticate, authorize("admin"), validateProduct, updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;
