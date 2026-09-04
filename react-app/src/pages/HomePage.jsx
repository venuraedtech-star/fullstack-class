import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import axiosInstance from "../api/axiosInstance";
import HeroBanner from "../components/HeroBanner";
import CategoryStrip from "../components/CategoryStrip";
import ProductGrid from "../components/ProductGrid";

const PAGE_SIZE = 12;

async function fetchProducts({ page, search }) {
  const params = new URLSearchParams({ page, pageSize: PAGE_SIZE });
  if (search) params.set("search", search);
  const { data } = await axiosInstance.get(`/products?${params.toString()}`);
  return data;
}

function HomePage() {
  const [page, setPage] = useState(1);
  // The header search box (Layout.jsx) is the single search entry point —
  // it already debounces typing and writes the result to the `q` URL param.
  // Reading it here (instead of keeping a second, disconnected local input)
  // is what makes that header search actually filter the product grid.
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const { data: categories } = useFetch("https://dummyjson.com/products/categories");
  const { addToCart } = useCart();

  // Reset to page 1 whenever the search term changes, without an effect —
  // adjusting state during render (rather than in a useEffect) avoids the
  // extra commit-then-rerender pass React flags for a synchronous setState
  // inside an effect.
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setPage(1);
  }

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

      {search && (
        <div className="mt-4 rounded-sm bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          Showing results for <span className="font-medium text-gray-900">&ldquo;{search}&rdquo;</span>
        </div>
      )}

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
