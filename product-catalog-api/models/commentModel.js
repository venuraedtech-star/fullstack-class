const prisma = require("../config/prisma");

async function getAllForProduct(productId) {
  return prisma.comment.findMany({
    where: { productId: Number(productId) },
    orderBy: { createdAt: "desc" },
  });
}

async function create(productId, { authorName, text }) {
  return prisma.comment.create({
    data: { productId: Number(productId), authorName, text },
  });
}

module.exports = { getAllForProduct, create };
