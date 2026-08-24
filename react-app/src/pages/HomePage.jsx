import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import HeroBanner from "../components/HeroBanner";
import CategoryStrip from "../components/CategoryStrip";
import ProductGrid from "../components/ProductGrid";

function ProductSection({ title, products, onAdd }) {
  if (!products.length) return null;

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between rounded-sm bg-white px-4 py-3 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <span className="text-sm font-medium text-brand">View All</span>
      </div>
      <ProductGrid products={products} onAdd={onAdd} columns="compact" />
    </section>
  );
}

function HomePage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const { data: productsData, loading, error } = useFetch(
    "https://dummyjson.com/products?limit=194",
  );
  const { data: categories } = useFetch("https://dummyjson.com/products/categories");
  const { addToCart } = useCart();

  const allProducts = productsData?.products ?? [];

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return allProducts;
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allProducts, searchTerm]);

  const bestSellers = useMemo(
    () => [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 12),
    [allProducts],
  );

  const topDeals = useMemo(
    () => [...allProducts].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 12),
    [allProducts],
  );

  const trending = useMemo(
    () => [...allProducts].sort((a, b) => b.stock - a.stock).slice(0, 12),
    [allProducts],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm bg-white p-8 text-center text-red-600 shadow-sm">
        Failed to load products. Please try again later.
      </div>
    );
  }

  if (searchTerm) {
    return (
      <div>
        <div className="mb-4 rounded-sm bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg text-gray-800">
            Showing results for <span className="font-medium">&quot;{searchTerm}&quot;</span>
            <span className="ml-2 text-sm text-gray-500">({filteredProducts.length} items)</span>
          </h1>
        </div>
        <ProductGrid products={filteredProducts} onAdd={addToCart} />
      </div>
    );
  }

  return (
    <>
      <HeroBanner />
      <CategoryStrip categories={categories} />
      <ProductSection title="Best of Electronics" products={bestSellers} onAdd={addToCart} />
      <ProductSection title="Top Deals" products={topDeals} onAdd={addToCart} />
      <ProductSection title="Trending Now" products={trending} onAdd={addToCart} />
    </>
  );
}

export default HomePage;
