// All request/response logic lives here. Data access goes through
// productModel — no fs/path usage in this file.
const productModel = require("../models/productModel");

async function getAllProducts(req, res, next) {
  try {
    let products = await productModel.getAll();
    const { category, maxPrice } = req.query;

    if (category) {
      products = products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      products = products.filter((p) => p.price <= max);
    }

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
    const newProduct = { ...req.body, id: Date.now() };

    const products = await productModel.getAll();
    products.push(newProduct);
    await productModel.saveAll(products);

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const products = await productModel.getAll();
    const existing = products.find((p) => p.id === id);

    if (!existing) {
      return res.status(404).json({ error: `No product found with id ${id}` });
    }

    const updated = { ...existing, ...req.body, id };
    const nextProducts = products.map((p) => (p.id === id ? updated : p));
    await productModel.saveAll(nextProducts);

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const products = await productModel.getAll();
    const exists = products.some((p) => p.id === id);

    if (!exists) {
      return res.status(404).json({ error: `No product found with id ${id}` });
    }

    const remaining = products.filter((p) => p.id !== id);
    await productModel.saveAll(remaining);

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
