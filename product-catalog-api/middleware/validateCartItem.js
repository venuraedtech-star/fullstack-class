// POST /cart — adding an item. quantity is optional (defaults to 1 in the
// controller/model), but if present it must be a valid positive number.
function validateAddToCart(req, res, next) {
  const { productId, quantity } = req.body ?? {};

  if (productId === undefined || typeof productId !== "number" || Number.isNaN(productId)) {
    return res.status(400).json({ error: "productId is required and must be a number" });
  }

  if (quantity !== undefined && (typeof quantity !== "number" || Number.isNaN(quantity) || quantity <= 0)) {
    return res.status(400).json({ error: "quantity must be a number greater than 0" });
  }

  next();
}

// PUT /cart/:productId — quantity is required here, since it's the whole
// point of the request.
function validateQuantity(req, res, next) {
  const { quantity } = req.body ?? {};

  if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "quantity is required and must be a number greater than 0" });
  }

  next();
}

module.exports = { validateAddToCart, validateQuantity };
