import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { formatPrice, getMrp, getProductImage } from "../utils/productUtils";

export function ProductCard({ product, onAdd }) {
  const { id, title, price, discountPercentage = 0, rating, stock } = product;
  const mrp = getMrp(price, discountPercentage);
  const image = getProductImage(product);

  return (
    <div className="group flex h-full flex-col bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link to={`/product/${id}`} className="flex flex-1 flex-col">
        <div className="relative mb-3 flex h-44 items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={title}
            className="max-h-full max-w-full object-contain transition group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <span className="absolute left-0 top-0 rounded-br bg-[#388e3c] px-2 py-0.5 text-xs font-medium text-white">
              {Math.round(discountPercentage)}% off
            </span>
          )}
        </div>

        <h3 className="mb-1 line-clamp-2 text-sm font-normal text-gray-800">{title}</h3>

        <div className="mb-2">
          <StarRating rating={rating ?? 4.2} reviewCount={Math.floor(stock * 2.5) || 120} />
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-medium text-gray-900">{formatPrice(price)}</span>
          {discountPercentage > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">{formatPrice(mrp)}</span>
              <span className="text-xs font-medium text-[#388e3c]">
                {Math.round(discountPercentage)}% off
              </span>
            </>
          )}
        </div>
      </Link>

      {onAdd && (
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="mt-3 w-full rounded-sm border border-flip-blue bg-white py-2 text-sm font-medium text-flip-blue transition hover:bg-flip-blue hover:text-white"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default ProductCard;
