const pool = require("../config/db");

// price/subtotal cast to float8 for the same reason as productModel — pg
// returns NUMERIC as a string by default, which would break JSON consumers
// expecting real numbers.
const SELECT_CART = `
  SELECT
    p.id AS product_id,
    p.title,
    p.price::float8 AS price,
    ci.quantity,
    (p.price * ci.quantity)::float8 AS subtotal
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
`;

async function getAll() {
  const { rows } = await pool.query(`${SELECT_CART} ORDER BY ci.id`);
  return rows;
}

// Upsert: adding a product already in the cart increments its quantity
// instead of creating a duplicate row (see the UNIQUE(product_id) constraint
// in db/schema.sql).
async function addItem(productId, quantity = 1) {
  const { rows } = await pool.query(
    `INSERT INTO cart_items (product_id, quantity)
     VALUES ($1, $2)
     ON CONFLICT (product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING product_id`,
    [productId, quantity],
  );
  return findByProductId(rows[0].product_id);
}

async function setQuantity(productId, quantity) {
  const { rows } = await pool.query(
    "UPDATE cart_items SET quantity = $1 WHERE product_id = $2 RETURNING product_id",
    [quantity, productId],
  );
  if (!rows[0]) return undefined;
  return findByProductId(rows[0].product_id);
}

async function removeItem(productId) {
  const { rows } = await pool.query(
    "DELETE FROM cart_items WHERE product_id = $1 RETURNING product_id",
    [productId],
  );
  return rows[0];
}

async function findByProductId(productId) {
  const { rows } = await pool.query(`${SELECT_CART} WHERE ci.product_id = $1`, [productId]);
  return rows[0];
}

module.exports = { getAll, addItem, setQuantity, removeItem, findByProductId };
