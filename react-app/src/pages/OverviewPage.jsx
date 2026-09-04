import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";

const API_BASE = "http://localhost:3000";

function OverviewPage() {
  const { user } = useAuth();
  const { data: response, loading, error } = useFetch(`${API_BASE}/products?pageSize=1000`);
  const products = response?.data ?? [];

  const categoryCount = new Set(
    products.map((product) => product.category?.name).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome, {user.name}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening in your catalog.</p>
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Failed to load products.</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">{products.length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">{categoryCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewPage;
