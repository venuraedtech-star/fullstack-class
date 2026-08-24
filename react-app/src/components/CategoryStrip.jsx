import { Link } from "react-router-dom";

const CATEGORY_ICONS = {
  beauty: "💄",
  fragrances: "🌸",
  furniture: "🛋️",
  groceries: "🛒",
  "home-decoration": "🏠",
  "kitchen-accessories": "🍳",
  laptops: "💻",
  "mens-shirts": "👔",
  "mens-shoes": "👞",
  "mens-watches": "⌚",
  "mobile-accessories": "📱",
  motorcycle: "🏍️",
  "skin-care": "🧴",
  smartphones: "📲",
  "sports-accessories": "⚽",
  sunglasses: "🕶️",
  tablets: "📱",
  tops: "👕",
  vehicle: "🚗",
  "womens-bags": "👜",
  "womens-dresses": "👗",
  "womens-jewellery": "💍",
  "womens-shoes": "👠",
  "womens-watches": "⌚",
};

function CategoryStrip({ categories }) {
  if (!categories?.length) return null;

  return (
    <div className="overflow-x-auto bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1248px] gap-6 px-4 py-4">
        {categories.slice(0, 12).map((category) => (
          <Link
            key={category.slug}
            to={`/categories?cat=${category.slug}`}
            className="flex min-w-[72px] flex-col items-center gap-1 text-center transition hover:text-flip-blue"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-flip-bg text-2xl">
              {CATEGORY_ICONS[category.slug] ?? "📦"}
            </span>
            <span className="max-w-[72px] truncate text-xs font-medium text-gray-700">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryStrip;
