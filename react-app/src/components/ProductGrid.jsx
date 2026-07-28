import { ProductCard } from "./ProductCard";

function ProductGrid({ products, onAdd }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No products found. Try a different serach
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          category={product.category}
          onAdd={() => onAdd(product)}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
