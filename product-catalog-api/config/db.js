// Shared connection pool. Safe to require anywhere — index.js calls
// dotenv.config() before requiring anything that could reach this module,
// so process.env.DATABASE_URL is already populated by the time this runs.
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = pool;
