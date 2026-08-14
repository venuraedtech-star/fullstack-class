// All request/response logic lives here. Data access goes through
// productModel — no pg/SQL usage in this file.
const productModel = require("../models/productModel");

async function getAllProducts(req, res, next) {
  try {
    const { category, maxPrice } = req.query;
    const products = await productModel.getAll({ category, maxPrice });
    res.json(products);
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
    const created = await productModel.create(req.body);
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
