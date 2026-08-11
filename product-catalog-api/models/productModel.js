// All file/data access for products lives here. Controllers should never
// touch fs/path directly — they call these functions instead.
const fs = require("fs/promises");
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "..", "data", "products.json");

async function getAll() {
  const raw = await fs.readFile(PRODUCTS_FILE, "utf-8");
  return JSON.parse(raw);
}

async function saveAll(products) {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

async function findById(id) {
  const products = await getAll();
  return products.find((p) => p.id === Number(id));
}

module.exports = { getAll, saveAll, findById };
