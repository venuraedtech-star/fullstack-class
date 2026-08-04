import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";

function AdminPage() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(
    "https://dummyjson.com/products?limit=194",
  );
  const [addedProducts, setAddedProducts] = useState([]);
  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [nextLocalId, setNextLocalId] = useState(10_000);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { title: "", price: "", image: null } });

  const products = useMemo(() => {
    const fetched = data?.products ?? [];
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

  function handleDelete(id) {
    setAddedProducts((prev) => prev.filter((product) => product.id !== id));
    setDeletedIds((prev) => new Set(prev).add(id));
  }

  function onSubmit({ title, price }) {
    const newProduct = {
      id: nextLocalId,
      title: title.trim(),
      price: Number(price),
      images: [imagePreview],
      category: "admin-added",
    };

    setNextLocalId((prev) => prev + 1);
    setAddedProducts((prev) => [newProduct, ...prev]);
    reset();
    setImagePreview("");
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
    return <p className="text-red-600">Error: Failed to fetch products.</p>;
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
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <img
                  src={product.images?.[0] ?? product.thumbnail}
                  alt={product.title}
                  className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 object-contain p-1"
                />
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
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminPage;
