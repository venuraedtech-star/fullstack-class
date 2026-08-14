# product-catalog-api

## Database setup

The app currently reads/writes `data/products.json` and doesn't use PostgreSQL yet — this sets up the database ahead of that (coming next class with Prisma).

1. Create the database:

   ```bash
   createdb product_catalog
   ```

   or, from inside `psql`:

   ```sql
   CREATE DATABASE product_catalog;
   ```

2. Create the tables:

   ```bash
   npm run db:schema
   ```

3. Load the seed data:

   ```bash
   npm run db:seed
   ```
