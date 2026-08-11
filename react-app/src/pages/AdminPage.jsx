import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";

const API_BASE = "http://localhost:3000";

// Date.now() is impure, so it can't be called directly in the component body
// (or in a handler the compiler can't prove runs outside render) — pulling it
// into its own module-level function keeps the id generation out of that
// analysis. This API doesn't assign ids for you like a real backend would, so
// the client has to generate one; Date.now() is unique enough for a demo.
function generateProductId() {
  return Date.now();
}

function AdminPage() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(`${API_BASE}/products`);
  const [addedProducts, setAddedProducts] = useState([]);
  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { title: "", price: "", image: null } });

  // products is derived from the fetched list plus this session's local
  // add/delete overlay, rather than synced into its own state via an
  // effect — that overlay resets on reload, but by then the server (and
  // therefore the next fetch) already reflects the real change.
  const products = useMemo(() => {
    const fetched = data ?? [];
    return [
      ...addedProducts,
      ...fetched.filter((product) => !deletedIds.has(product.id)),
    ];
  }, [data, addedProducts, deletedIds]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  async function handleDelete(id) {
    setSubmitError("");
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      setAddedProducts((prev) => prev.filter((product) => product.id !== id));
      setDeletedIds((prev) => new Set(prev).add(id));
    } catch {
      setSubmitError(
        "Could not delete product — make sure the API server is running (cd product-catalog-api && npm start).",
      );
    }
  }

  async function onSubmit({ title, price }) {
    setSubmitError("");
    const newProduct = {
      id: generateProductId(),
      title: title.trim(),
      price: Number(price),
      images: [imagePreview],
      category: "admin-added",
    };

    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Create failed");
      const created = await response.json();
      setAddedProducts((prev) => [created, ...prev]);
      reset();
      setImagePreview("");
    } catch {
      setSubmitError(
        "Could not add product — make sure the API server is running (cd product-catalog-api && npm start).",
      );
    }
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading products...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Error: Failed to fetch products. Make sure the API server is running
        (cd product-catalog-api && npm start).
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-500">Welcome, {user.username}</p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Add Product</h2>
        {submitError && (
          <p className="mb-4 text-sm text-red-600">{submitError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-1 block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
              {...register("image", { required: "Image is required" })}
              onChange={(event) => {
                register("image").onChange(event);
                handleImageChange(event);
              }}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-24 w-24 rounded-lg border border-gray-200 object-contain"
              />
            )}
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            Add Product
          </button>
        </form>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Products</h2>

        <input
          type="text"
          placeholder="Search products by title..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />

        {filteredProducts.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No products found.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredProducts.map((product) => {
              const image = product.images?.[0] ?? product.thumbnail;
              return (
                <li
                  key={product.id}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  {image ? (
                    <img
                      src={image}
                      alt={product.title}
                      className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 object-contain p-1"
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {product.title}
                    </p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminPage;
