import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import ProductGrid from "../components/ProductGrid";

const PAGE_SIZE = 20;

const SORT_OPTIONS = {
  "title-asc": { sortBy: "title", order: "asc", label: "Popularity" },
  "price-asc": { sortBy: "price", order: "asc", label: "Price: Low to High" },
  "price-desc": { sortBy: "price", order: "desc", label: "Price: High to Low" },
};

function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortValue, setSortValue] = useState("title-asc");
  const [page, setPage] = useState(1);

  const { data: categories } = useFetch("https://dummyjson.com/products/categories");
  const { addToCart } = useCart();

  const productsUrl = useMemo(() => {
    const base = selectedCategory
      ? `https://dummyjson.com/products/category/${selectedCategory}`
      : "https://dummyjson.com/products";
    const { sortBy, order } = SORT_OPTIONS[sortValue];
    const skip = (page - 1) * PAGE_SIZE;
    return `${base}?limit=${PAGE_SIZE}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
  }, [selectedCategory, sortValue, page]);

  const { data, loading, error } = useFetch(productsUrl);

  function handleSelectCategory(slug) {
    setSelectedCategory(slug);
    setPage(1);
  }

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const selectedName =
    categories?.find((c) => c.slug === selectedCategory)?.name ?? "All Products";

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <aside className="w-full shrink-0 rounded-sm bg-white p-4 shadow-sm md:w-56">
        <h2 className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Filters
        </h2>
        <p className="mb-2 text-xs font-medium text-gray-400">CATEGORY</p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                selectedCategory === null
                  ? "bg-flip-blue/10 font-medium text-flip-blue"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Categories
            </button>
          </li>
          {categories?.map((category) => (
            <li key={category.slug}>
              <button
                type="button"
                onClick={() => handleSelectCategory(category.slug)}
                className={`w-full rounded px-3 py-2 text-left text-sm capitalize transition ${
                  selectedCategory === category.slug
                    ? "bg-flip-blue/10 font-medium text-flip-blue"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-medium capitalize text-gray-800">{selectedName}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by</span>
            <select
              value={sortValue}
              onChange={(event) => {
                setSortValue(event.target.value);
                setPage(1);
              }}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-flip-blue"
            >
              {Object.entries(SORT_OPTIONS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-flip-blue border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-sm bg-white p-8 text-center text-red-600 shadow-sm">
            Failed to fetch products.
          </div>
        )}

        {data && (
          <>
            <p className="mb-3 text-sm text-gray-500">
              {data.total} product{data.total !== 1 ? "s" : ""} found
            </p>
            <ProductGrid products={data.products} onAdd={addToCart} />
            {pageCount > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  disabled={page === pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
