import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../utils/productUtils";

function OrderConfirmationPage() {
  const location = useLocation();
  const total = location.state?.total;
  const orderId = location.state?.orderId;

  return (
    <div className="rounded-sm bg-white py-16 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <svg className="h-10 w-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-medium text-gray-900">Order placed successfully!</h1>
      {orderId && (
        <p className="mb-1 text-sm text-gray-500">Order #{orderId}</p>
      )}
      {typeof total === "number" && (
        <p className="mb-6 text-gray-500">Total paid: {formatPrice(total)}</p>
      )}
      <Link
        to="/"
        className="inline-block rounded-sm bg-brand px-8 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderConfirmationPage;
