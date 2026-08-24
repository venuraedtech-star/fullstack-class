import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { formatPrice, getProductImage } from "../utils/productUtils";

function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="rounded-sm bg-white py-16 text-center shadow-sm">
        <svg className="mx-auto mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="mb-2 text-lg font-medium text-gray-800">Your cart is empty</h2>
        <p className="mb-6 text-sm text-gray-500">Add items to it now</p>
        <Link
          to="/"
          className="inline-block rounded-sm bg-flip-blue px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 space-y-3">
        <div className="rounded-sm bg-white px-4 py-3 shadow-sm">
          <h1 className="text-lg font-medium text-gray-800">
            My Cart <span className="text-sm font-normal text-gray-500">({cart.length} items)</span>
          </h1>
        </div>

        {cart.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center gap-4 rounded-sm bg-white p-4 shadow-sm"
          >
            <img
              src={getProductImage(product)}
              alt={product.title}
              className="h-20 w-20 object-contain"
            />
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${product.id}`}
                className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-flip-blue"
              >
                {product.title}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{formatPrice(product.price)} each</p>
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                className="mt-2 text-sm font-medium text-flip-blue hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center rounded border border-gray-300">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <span className="min-w-[40px] border-x border-gray-300 px-3 py-1.5 text-center text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <p className="min-w-[80px] text-right text-base font-medium text-gray-900">
              {formatPrice(product.price * quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-sm bg-white p-6 shadow-sm lg:w-80">
        <h2 className="mb-4 border-b pb-3 text-gray-500">PRICE DETAILS</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Price ({cart.length} items)</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Charges</span>
            <span className="text-[#388e3c]">FREE</span>
          </div>
        </div>
        <div className="my-4 border-t border-dashed" />
        <div className="mb-6 flex justify-between text-base font-medium">
          <span>Total Amount</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="w-full rounded-sm bg-flip-orange py-3 text-sm font-medium text-white shadow transition hover:bg-orange-600"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}

export default CartPage;
