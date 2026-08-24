import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import StarRating from "../components/StarRating";
import { formatPrice, getMrp, getProductImage } from "../utils/productUtils";

function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(`https://dummyjson.com/products/${id}`);
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm bg-white p-8 text-center text-red-600 shadow-sm">
        Failed to load product.
      </div>
    );
  }

  if (!product) return null;

  const mrp = getMrp(product.price, product.discountPercentage);
  const image = getProductImage(product);

  return (
    <div className="rounded-sm bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:gap-10 md:p-8">
        <div className="flex flex-1 items-center justify-center border-b pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <img
            src={image}
            alt={product.title}
            className="max-h-80 max-w-full object-contain"
          />
        </div>

        <div className="flex-1">
          <p className="mb-1 text-sm capitalize text-gray-500">{product.brand}</p>
          <h1 className="mb-3 text-xl font-medium text-gray-900 md:text-2xl">{product.title}</h1>

          <div className="mb-4 flex items-center gap-3">
            <StarRating
              rating={product.rating ?? 4.2}
              reviewCount={Math.floor(product.stock * 2.5) || 120}
            />
            <span className="text-sm text-success font-medium">
              {Math.round(product.discountPercentage ?? 0)}% off
            </span>
          </div>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-3xl font-medium text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-lg text-gray-500 line-through">{formatPrice(mrp)}</span>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded bg-cream px-3 py-2">
              <span className="text-gray-500">Category</span>
              <p className="font-medium capitalize">{product.category}</p>
            </div>
            <div className="rounded bg-cream px-3 py-2">
              <span className="text-gray-500">Stock</span>
              <p className="font-medium text-success">
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-sm bg-deal px-10 py-3 text-sm font-medium text-white shadow transition hover:bg-deal-dark"
            >
              ADD TO CART
            </button>
            <Link
              to="/cart"
              onClick={() => addToCart(product)}
              className="rounded-sm bg-deal/90 px-10 py-3 text-sm font-medium text-white shadow transition hover:bg-deal-dark"
            >
              BUY NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
