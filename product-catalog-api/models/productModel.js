const pool = require("../config/db");
const categoryModel = require("./categoryModel");

// Every SELECT returns the category as a plain string (via this JOIN),
// matching the response shape controllers/frontend already expect from the
// old file-based version, even though the DB normalizes it into its own
// table.
// price::float8 — pg returns NUMERIC columns as strings by default (to avoid
// float precision loss on huge values), which would silently break every
// consumer expecting a JSON number like the old file-based API returned.
// Casting here keeps the response shape a real number.
const SELECT_PRODUCTS = `
  SELECT p.id, p.title, p.price::float8 AS price, p.description, p.image_url, p.created_at, c.name AS category
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

async function getAll({ category, maxPrice } = {}) {
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`c.name ILIKE $${values.length}`);
  }

  if (maxPrice) {
    values.push(Number(maxPrice));
    conditions.push(`p.price <= $${values.length}`);
  }

  const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query(`${SELECT_PRODUCTS}${where} ORDER BY p.id`, values);
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(`${SELECT_PRODUCTS} WHERE p.id = $1`, [id]);
  return rows[0];
}

// description/image_url default to null (not undefined) — pg's bind
// parameters need an explicit null for "no value", not a missing JS value.
async function create({ title, price, category, description = null, image_url = null }) {
  const categoryId = await categoryModel.findOrCreateIdByName(category);

  const { rows } = await pool.query(
    `INSERT INTO products (title, price, category_id, description, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [title, price, categoryId, description, image_url],
  );

  return findById(rows[0].id);
}

async function update(id, { title, price, category, description = null, image_url = null }) {
  const categoryId = await categoryModel.findOrCreateIdByName(category);

  const { rows } = await pool.query(
    `UPDATE products
     SET title = $1, price = $2, category_id = $3, description = $4, image_url = $5
     WHERE id = $6
     RETURNING id`,
    [title, price, categoryId, description, image_url, id],
  );

  if (!rows[0]) return undefined;
  return findById(rows[0].id);
}

async function remove(id) {
  const { rows } = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING id",
    [id],
  );
  return rows[0];
}

module.exports = { getAll, findById, create, update, remove };
