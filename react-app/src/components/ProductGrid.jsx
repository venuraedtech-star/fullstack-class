import { ProductCard } from "./ProductCard";

function ProductGrid({ products, onAdd, columns = "default" }) {
  if (products.length === 0) {
    return (
      <div className="rounded-sm bg-white py-16 text-center shadow-sm">
        <p className="text-gray-500">No products found. Try a different search.</p>
      </div>
    );
  }

  const gridClass =
    columns === "compact"
      ? "grid grid-cols-2 gap-px bg-gray-200 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      : "grid grid-cols-1 gap-px bg-gray-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default ProductGrid;
