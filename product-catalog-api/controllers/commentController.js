const commentModel = require("../models/commentModel");

async function getComments(req, res, next) {
  try {
    const comments = await commentModel.getAllForProduct(req.params.id);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

async function createComment(req, res, next) {
  try {
    const created = await commentModel.create(req.params.id, req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

module.exports = { getComments, createComment };
