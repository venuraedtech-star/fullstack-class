// Shared Prisma Client instance — mirrors config/db.js's shared pg Pool.
// Every file that needs Prisma imports this instead of creating its own
// PrismaClient, which would otherwise open a separate connection pool.
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
