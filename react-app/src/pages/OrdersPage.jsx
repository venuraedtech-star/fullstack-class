import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { formatPrice } from "../utils/productUtils";

function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 2h9l3 3v17H6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    axiosInstance
      .get("/orders")
      .then(({ data }) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.response?.status === 403
            ? "You don't have permission to view orders — an admin account is required."
            : "Could not load orders — make sure the API server is running.";
        setError(message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Orders</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Track and manage customer orders.
        </p>
      </div>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {orders && orders.length === 0 && (
        <section className="rounded-xl bg-white p-12 text-center shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
          <OrdersIcon className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-700" />
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            No orders yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Once customers start checking out, their orders will show up here so you can
            track fulfillment and history.
          </p>
        </section>
      )}

      {orders && orders.length > 0 && (
        <section className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Order #{order.id} · {order.user?.name ?? "Unknown customer"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {order.status}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default OrdersPage;
