// Applied to POST and PUT (see routes/productRoutes.js) — checks the
// request body has a usable title, price, and category before the
// controller ever touches it.
function validateProduct(req, res, next) {
  const { title, price, category } = req.body ?? {};

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({ error: "title is required and must be a non-empty string" });
  }

  if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
    return res
      .status(400)
      .json({ error: "price is required and must be a number greater than 0" });
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    return res
      .status(400)
      .json({ error: "category is required and must be a non-empty string" });
  }

  next();
}

module.exports = validateProduct;
