const categoryModel = require("../models/categoryModel");

// Postgres error code for a foreign-key violation — thrown here when
// deleting a category that products still reference.
const FOREIGN_KEY_VIOLATION = "23503";

async function getAllCategories(req, res, next) {
  try {
    res.json(await categoryModel.getAll());
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ error: `No category found with id ${req.params.id}` });
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const created = await categoryModel.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await categoryModel.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: `No category found with id ${id}` });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await categoryModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: `No category found with id ${id}` });
    }

    res.status(204).end();
  } catch (err) {
    // A category with existing products can't be deleted (products.category_id
    // references it) — surface that as a clean 409 instead of a raw 500.
    if (err.code === FOREIGN_KEY_VIOLATION) {
      return res.status(409).json({
        error: "Cannot delete a category that still has products assigned to it",
      });
    }
    next(err);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
