const prisma = require("../config/prisma");

// Prisma's Decimal type (used for price, @db.Decimal) serializes to a
// STRING via JSON.stringify by default — this would silently reintroduce
// the exact "NUMERIC comes back as a string" bug the old pg-based version
// explicitly cast around. Converting to a real Number before every response.
function serializeProduct(product) {
  return { ...product, price: Number(product.price) };
}

// Request bodies (validateProduct middleware, the Admin frontend) send
// `category` as a plain name string, not a categoryId — this resolves that
// name to an id, creating the category if it doesn't exist yet, matching
// the find-or-create behavior the pg-based version had via categoryModel.
async function resolveCategoryId(categoryName) {
  const category = await prisma.category.upsert({
    where: { name: categoryName },
    update: {},
    create: { name: categoryName },
  });
  return category.id;
}

async function getAll({ category, maxPrice, sort, page, pageSize, search } = {}) {
  const where = {};

  if (category) {
    where.category = { is: { name: { equals: category, mode: "insensitive" } } };
  }

  if (maxPrice) {
    where.price = { lte: Number(maxPrice) };
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const direction = sort === "desc" ? "desc" : "asc";
  const pageNum = Math.max(1, Number(page) || 1);
  const sizeNum = Math.max(1, Number(pageSize) || 20);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { price: direction },
      skip: (pageNum - 1) * sizeNum,
      take: sizeNum,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map(serializeProduct),
    pagination: {
      page: pageNum,
      pageSize: sizeNum,
      total,
      totalPages: Math.ceil(total / sizeNum),
    },
  };
}

async function findById(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return product ? serializeProduct(product) : undefined;
}

// The Admin form now sends a real categoryId (picked from an existing
// category), used directly when present. category (a plain name string)
// is kept as a fallback for older callers — Postman, seed scripts — that
// still send a name to be resolved/created rather than an id.
async function resolveCategory({ categoryId, category }) {
  if (categoryId) return Number(categoryId);
  return resolveCategoryId(category);
}

async function create({ title, price, category, categoryId, description, image_url }) {
  const resolvedCategoryId = await resolveCategory({ categoryId, category });

  const product = await prisma.product.create({
    data: { title, price, description, imageUrl: image_url, categoryId: resolvedCategoryId },
    include: { category: true },
  });

  return serializeProduct(product);
}

async function update(id, { title, price, category, categoryId, description, image_url }) {
  const resolvedCategoryId = await resolveCategory({ categoryId, category });

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { title, price, description, imageUrl: image_url, categoryId: resolvedCategoryId },
      include: { category: true },
    });
    return serializeProduct(product);
  } catch (err) {
    // P2025 = Prisma's "record to update not found" — unlike raw SQL
    // (which just affects 0 rows), Prisma throws here. Returning undefined
    // preserves the controller's existing `if (!updated) -> 404` pattern.
    if (err.code === "P2025") return undefined;
    throw err;
  }
}

async function remove(id) {
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    return { id: Number(id) };
  } catch (err) {
    if (err.code === "P2025") return undefined;
    throw err;
  }
}

module.exports = { getAll, findById, create, update, remove };
