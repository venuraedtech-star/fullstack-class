function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 2h9l3 3v17H6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Orders</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Track and manage customer orders.
        </p>
      </div>

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
    </div>
  );
}

export default OrdersPage;
