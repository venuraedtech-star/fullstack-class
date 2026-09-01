import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { getProductImage } from "../utils/productUtils";

function deriveErrorMessage(err, action) {
  if (err.response?.status === 403) {
    return "You don't have permission to do this — an admin account is required.";
  }
  return `Could not ${action} product — make sure the API server is running (cd product-catalog-api && npm start).`;
}

async function fetchProducts() {
  const { data } = await axiosInstance.get("/products?pageSize=100");
  return data.data;
}

async function fetchCategories() {
  const { data } = await axiosInstance.get("/categories");
  return data;
}

function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading: loading, isError: error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { title: "", price: "", categoryId: "", image: null } });

  const addMutation = useMutation({
    mutationFn: (formData) => axiosInstance.post("/products", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      setImagePreview("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const products = useMemo(() => data ?? [], [data]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  // Builds a real multipart/form-data body so the file travels as an
  // actual upload (see product-catalog-api's upload.single('image')) —
  // axios sets the multipart Content-Type + boundary itself from a
  // FormData body, so it's never set manually here.
  function onSubmit({ title, price, categoryId, image }) {
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("image", image[0]);
    addMutation.mutate(formData);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading products...</p>;
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Welcome, {user.name}</p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Add Product</h2>
        {addMutation.isError && (
          <p className="mb-4 text-sm text-red-600">
            {deriveErrorMessage(addMutation.error, "add")}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              {...register("title", {
                required: "Title is required",
                validate: (value) => value.trim().length > 0 || "Title is required",
              })}
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
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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
              htmlFor="categoryId"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="categoryId"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              {...register("categoryId", { required: "Category is required" })}
            >
              <option value="">Select a category...</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:file:bg-blue-900/40 dark:file:text-blue-300"
              {...register("image", {
                required: "Image is required",
                validate: (files) =>
                  files?.[0]?.type.startsWith("image/") || "File must be an image",
              })}
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
                className="mt-3 h-24 w-24 rounded-lg border border-gray-200 object-contain dark:border-gray-700"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={addMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {addMutation.isPending ? "Adding..." : "Add Product"}
          </button>
        </form>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Products</h2>

        {deleteMutation.isError && (
          <p className="mb-4 text-sm text-red-600">
            {deriveErrorMessage(deleteMutation.error, "delete")}
          </p>
        )}

        <input
          type="text"
          placeholder="Search products by title..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />

        {filteredProducts.length === 0 ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">No products found.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredProducts.map((product) => {
              const image = getProductImage(product);
              return (
                <li
                  key={product.id}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  {image ? (
                    <img
                      src={image}
                      alt={product.title}
                      className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 object-contain p-1 dark:border-gray-700 dark:bg-gray-800"
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {product.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">${product.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(product.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === product.id}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
                    {deleteMutation.isPending && deleteMutation.variables === product.id
                      ? "Deleting..."
                      : "Delete"}
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
