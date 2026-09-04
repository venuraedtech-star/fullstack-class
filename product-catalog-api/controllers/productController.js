// All request/response logic lives here. Data access goes through
// productModel — no Prisma/SQL usage in this file.
const productModel = require("../models/productModel");

async function getAllProducts(req, res, next) {
  try {
    const { category, maxPrice, sort, page, pageSize, search } = req.query;
    const result = await productModel.getAll({ category, maxPrice, sort, page, pageSize, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ error: `No product found with id ${req.params.id}` });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    // req.file exists when the request was multipart/form-data with an
    // uploaded image (see middleware/upload.js). Otherwise fall back to a
    // plain imageUrl in the body — either camelCase (new callers) or the
    // original image_url (existing Admin frontend, Postman, seed scripts).
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl ?? req.body.image_url;

    const created = await productModel.create({
      ...req.body,
      price: Number(req.body.price),
      image_url,
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await productModel.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: `No product found with id ${id}` });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await productModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: `No product found with id ${id}` });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
