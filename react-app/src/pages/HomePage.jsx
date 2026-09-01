import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import axiosInstance from "../api/axiosInstance";
import HeroBanner from "../components/HeroBanner";
import CategoryStrip from "../components/CategoryStrip";
import ProductGrid from "../components/ProductGrid";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

async function fetchProducts({ page, search }) {
  const params = new URLSearchParams({ page, pageSize: PAGE_SIZE });
  if (search) params.set("search", search);
  const { data } = await axiosInstance.get(`/products?${params.toString()}`);
  return data;
}

function HomePage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { data: categories } = useFetch("https://dummyjson.com/products/categories");
  const { addToCart } = useCart();

  // Debounce the search box before it hits the query — the query key
  // includes `search`, so committing it (rather than searchInput directly)
  // is what avoids firing a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => fetchProducts({ page, search }),
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <HeroBanner />
      <CategoryStrip categories={categories} />

      <div className="mt-4 rounded-sm bg-white px-4 py-3 shadow-sm">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search our catalog..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-sm bg-white p-8 text-center text-red-600 shadow-sm">
          Failed to load products. Please try again later.
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-3">
            <ProductGrid products={products} onAdd={addToCart} />
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default HomePage;
