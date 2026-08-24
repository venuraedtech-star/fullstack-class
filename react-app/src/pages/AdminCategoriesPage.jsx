import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../hooks/useFetch";

const API_BASE = "http://localhost:3000";

function AdminCategoriesPage() {
  const { data, loading, error } = useFetch(`${API_BASE}/categories`);
  const [addedCategories, setAddedCategories] = useState([]);
  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "" } });

  // Same local add/delete overlay pattern as AdminPage.jsx — resets on
  // reload, but by then the server (and the next fetch) already reflects
  // the real change.
  const categories = useMemo(() => {
    const fetched = data ?? [];
    return [
      ...addedCategories,
      ...fetched.filter((category) => !deletedIds.has(category.id)),
    ];
  }, [data, addedCategories, deletedIds]);

  async function onSubmit({ name }) {
    setSubmitError("");
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!response.ok) throw new Error("Create failed");
      const created = await response.json();
      setAddedCategories((prev) => [created, ...prev]);
      reset();
    } catch {
      setSubmitError(
        "Could not add category — make sure the API server is running (cd product-catalog-api && npm start).",
      );
    }
  }

  async function handleDelete(id) {
    setSubmitError("");
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
      });
      if (response.status === 409) {
        const body = await response.json();
        throw new Error(body.error);
      }
      if (!response.ok) throw new Error("Delete failed");
      setAddedCategories((prev) => prev.filter((category) => category.id !== id));
      setDeletedIds((prev) => new Set(prev).add(id));
    } catch (err) {
      setSubmitError(
        err.message === "Delete failed"
          ? "Could not delete category — make sure the API server is running (cd product-catalog-api && npm start)."
          : err.message,
      );
    }
  }

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        Error: Failed to fetch categories. Make sure the API server is running
        (cd product-catalog-api && npm start).
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Categories</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage the categories products can be assigned to.
        </p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Add Category</h2>
        {submitError && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{submitError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-3">
          <div className="flex-1">
            <label htmlFor="name" className="sr-only">
              Category name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Home Appliances"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              {...register("name", {
                required: "Category name is required",
                validate: (value) => value.trim().length > 0 || "Category name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            Add Category
          </button>
        </form>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">All Categories</h2>

        {categories.length === 0 ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">No categories yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <span className="font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminCategoriesPage;
