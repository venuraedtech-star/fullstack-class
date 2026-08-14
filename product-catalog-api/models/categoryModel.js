const pool = require("../config/db");

async function getAll() {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY id");
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
  return rows[0];
}

async function create({ name }) {
  const { rows } = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING *",
    [name],
  );
  return rows[0];
}

async function update(id, { name }) {
  const { rows } = await pool.query(
    "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
    [name, id],
  );
  return rows[0];
}

async function remove(id) {
  const { rows } = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING id",
    [id],
  );
  return rows[0];
}

// Used by productModel to resolve a category name (as sent by API clients)
// into the id the products table actually stores. Creates the category if
// it doesn't exist yet, so e.g. Admin's "admin-added" category just works.
async function findOrCreateIdByName(name) {
  const { rows } = await pool.query(
    `INSERT INTO categories (name) VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name],
  );
  return rows[0].id;
}

module.exports = { getAll, findById, create, update, remove, findOrCreateIdByName };
