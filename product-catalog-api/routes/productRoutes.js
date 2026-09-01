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
const upload = require("../middleware/upload");
const validateComment = require("../middleware/validateComment");
const { getComments, createComment } = require("../controllers/commentController");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorize("admin"), upload.single("image"), validateProduct, createProduct);
router.put("/:id", authenticate, authorize("admin"), validateProduct, updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

// Public — no auth required for this exercise.
router.get("/:id/comments", getComments);
router.post("/:id/comments", validateComment, createComment);

module.exports = router;
