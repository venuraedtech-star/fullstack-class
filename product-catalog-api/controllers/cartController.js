const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

async function getCart(req, res, next) {
  try {
    res.json(await cartModel.getAll());
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    // Checked here (rather than left to the products FK constraint) so a
    // bad productId gets a clean 404 instead of a raw constraint-violation 500.
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: `No product found with id ${productId}` });
    }

    const item = await cartModel.addItem(productId, quantity ?? 1);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const updated = await cartModel.setQuantity(productId, req.body.quantity);

    if (!updated) {
      return res
        .status(404)
        .json({ error: `Product ${productId} is not in the cart` });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function removeFromCart(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const deleted = await cartModel.removeItem(productId);

    if (!deleted) {
      return res
        .status(404)
        .json({ error: `Product ${productId} is not in the cart` });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
