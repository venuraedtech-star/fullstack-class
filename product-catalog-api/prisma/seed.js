const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CATEGORIES = [
  "Electronics",
  "Bags & Accessories",
  "Home & Furniture",
  "Clothing",
  "Sports & Outdoors",
];

const TAGS = ["new", "bestseller", "sale", "premium", "eco-friendly", "limited"];

// title, category, price, description, image URL
const PRODUCTS = [
  // Electronics
  ["Wireless Over-Ear Headphones", "Electronics", 129.99, "Noise-isolating wireless headphones with 30-hour battery life.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"],
  ["Smart Fitness Watch", "Electronics", 199.0, "Tracks heart rate, sleep, and workouts with a week-long battery.", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80"],
  ["Portable Bluetooth Speaker", "Electronics", 79.5, "Compact waterproof speaker with rich, room-filling sound.", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"],
  ["Mechanical Keyboard", "Electronics", 149.0, "Hot-swappable mechanical keyboard with tactile switches.", "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"],
  ["1080p Webcam", "Electronics", 59.99, "Crisp 1080p webcam with a built-in privacy shutter.", "https://images.unsplash.com/photo-1623949556303-b0d17d198863?auto=format&fit=crop&w=600&q=80"],

  // Bags & Accessories
  ["Leather Bifold Wallet", "Bags & Accessories", 49.0, "Full-grain leather wallet with six card slots.", "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"],
  ["Canvas Tote Bag", "Bags & Accessories", 34.5, "Durable canvas tote with reinforced handles, everyday size.", "https://images.unsplash.com/photo-1663573690125-d326a87a2535?auto=format&fit=crop&w=600&q=80"],
  ["Travel Duffel Bag", "Bags & Accessories", 89.0, "Weekend duffel with a separate shoe compartment.", "https://images.unsplash.com/photo-1692506530242-c12d6c3ae2e2?auto=format&fit=crop&w=600&q=80"],
  ["Polarized Sunglasses", "Bags & Accessories", 64.0, "UV400 polarized lenses with a lightweight acetate frame.", "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80"],
  ["Crossbody Sling Bag", "Bags & Accessories", 39.99, "Compact crossbody bag with anti-theft zip pockets.", "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=600&q=80"],

  // Home & Furniture
  ["Mid-Century Accent Chair", "Home & Furniture", 279.0, "Upholstered accent chair with solid wood legs.", "https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&w=600&q=80"],
  ["Ceramic Table Lamp", "Home & Furniture", 68.0, "Warm ambient table lamp with a linen shade.", "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=600&q=80"],
  ["Hand-Thrown Ceramic Vase", "Home & Furniture", 44.0, "Matte-glazed stoneware vase, food-safe and watertight.", "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=600&q=80"],
  ["Throw Pillow Set (2-Pack)", "Home & Furniture", 32.0, "Soft woven throw pillow covers, machine washable.", "https://images.unsplash.com/photo-1691256676366-370303d55b61?auto=format&fit=crop&w=600&q=80"],
  ["Wooden Bookshelf", "Home & Furniture", 189.0, "Five-tier solid pine bookshelf with a natural finish.", "https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?auto=format&fit=crop&w=600&q=80"],

  // Clothing
  ["Classic Denim Jacket", "Clothing", 74.0, "Mid-wash denim jacket with a relaxed, everyday fit.", "https://images.unsplash.com/photo-1537465978529-d23b17165b3b?auto=format&fit=crop&w=600&q=80"],
  ["Organic Cotton T-Shirt", "Clothing", 22.0, "Breathable 100% organic cotton, pre-shrunk.", "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"],
  ["Merino Wool Sweater", "Clothing", 98.0, "Soft merino wool crewneck, naturally temperature-regulating.", "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=600&q=80"],
  ["Running Shoes", "Clothing", 119.99, "Lightweight running shoes with responsive cushioning.", "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80"],
  ["Cotton Baseball Cap", "Clothing", 18.5, "Adjustable cotton twill cap with a curved brim.", "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80"],

  // Sports & Outdoors
  ["Non-Slip Yoga Mat", "Sports & Outdoors", 39.0, "Extra-thick yoga mat with a non-slip textured surface.", "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=600&q=80"],
  ["2-Person Camping Tent", "Sports & Outdoors", 129.0, "Weatherproof camping tent, sets up in under 5 minutes.", "https://images.unsplash.com/photo-1631635589499-afd87d52bf64?auto=format&fit=crop&w=600&q=80"],
  ["Insulated Water Bottle", "Sports & Outdoors", 27.99, "Keeps drinks cold for 24 hours or hot for 12.", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"],
  ["Hiking Daypack", "Sports & Outdoors", 74.5, "30L hiking daypack with a padded hip belt.", "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80"],
  ["Resistance Bands Set", "Sports & Outdoors", 24.0, "Five-band resistance set for strength training anywhere.", "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?auto=format&fit=crop&w=600&q=80"],
];

function pickRandomTags(tagRecords, min = 1, max = 2) {
  const count = Math.random() < 0.5 ? min : max;
  const shuffled = [...tagRecords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function main() {
  const categoryRecords = {};
  for (const name of CATEGORIES) {
    categoryRecords[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Upserted ${CATEGORIES.length} categories.`);

  const tagRecords = [];
  for (const name of TAGS) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tagRecords.push(tag);
  }
  console.log(`Upserted ${TAGS.length} tags.`);

  // Clear existing products (and their tag links) so the catalog is a
  // clean, coherent multi-category set rather than the old data mixed
  // with the new — product_tags first, since it has FKs into products.
  await prisma.productTag.deleteMany({});
  await prisma.product.deleteMany({});
  console.log("Cleared existing products.");

  let created = 0;
  for (const [title, categoryName, price, description, imageUrl] of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        title,
        price,
        description,
        imageUrl,
        categoryId: categoryRecords[categoryName].id,
      },
    });

    const tags = pickRandomTags(tagRecords);
    for (const tag of tags) {
      await prisma.productTag.create({
        data: { productId: product.id, tagId: tag.id },
      });
    }

    created += 1;
  }

  console.log(`Created ${created} products across ${CATEGORIES.length} categories.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
