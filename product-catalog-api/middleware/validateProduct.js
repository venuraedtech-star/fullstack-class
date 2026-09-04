// Applied to POST and PUT (see routes/productRoutes.js) — checks the
// request body has a usable title, price, and category before the
// controller ever touches it. Runs after multer on the file-upload route,
// so req.body may be either JSON (typed values) or multipart/form-data
// (every field arrives as a string, including price/categoryId) — checks
// here coerce rather than requiring a specific type, so both work.
function validateProduct(req, res, next) {
  const { title, price, category, categoryId } = req.body ?? {};

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({ error: "title is required and must be a non-empty string" });
  }

  const numericPrice = Number(price);
  if (price === undefined || price === null || price === "" || Number.isNaN(numericPrice) || numericPrice <= 0) {
    return res
      .status(400)
      .json({ error: "price is required and must be a number greater than 0" });
  }

  const hasCategoryName = typeof category === "string" && category.trim() !== "";
  const hasCategoryId = categoryId !== undefined && categoryId !== null && categoryId !== "" && !Number.isNaN(Number(categoryId));
  if (!hasCategoryName && !hasCategoryId) {
    return res
      .status(400)
      .json({ error: "category or categoryId is required" });
  }

  next();
}

module.exports = validateProduct;
