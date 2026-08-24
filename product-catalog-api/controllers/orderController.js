const orderModel = require("../models/orderModel");

async function createOrder(req, res, next) {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;
    const order = await orderModel.create(req.user.userId, { items, totalAmount, address, paymentMethod });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    res.json(await orderModel.getAll());
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getAllOrders };
