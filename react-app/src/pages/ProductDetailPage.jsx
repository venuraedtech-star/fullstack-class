import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCart from "../hooks/useCart";
import axiosInstance from "../api/axiosInstance";
import { formatPrice, getProductImage } from "../utils/productUtils";

async function fetchProduct(id) {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
}

function CommentsSection({ productId }) {
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", productId],
    queryFn: () => axiosInstance.get(`/products/${productId}/comments`).then((res) => res.data),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { authorName: "", text: "" } });

  const mutation = useMutation({
    mutationFn: (newComment) => axiosInstance.post(`/products/${productId}/comments`, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
      reset();
    },
  });

  return (
    <div className="mt-2 border-t pt-6">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Comments</h2>

      {isLoading && <p className="text-sm text-gray-500">Loading comments...</p>}

      {comments && comments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts.</p>
      )}

      {comments && comments.length > 0 && (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-sm bg-cream p-3">
              <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
              <p className="mt-1 text-sm text-gray-600">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 max-w-md space-y-3">
        <div>
          <label htmlFor="authorName" className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="authorName"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            {...register("authorName", {
              required: "Name is required",
              validate: (value) => value.trim().length > 0 || "Name is required",
            })}
          />
          {errors.authorName && (
            <p className="mt-1 text-sm text-red-600">{errors.authorName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="text" className="mb-1 block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            id="text"
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            {...register("text", {
              required: "Comment is required",
              maxLength: { value: 500, message: "Must be 500 characters or fewer" },
              validate: (value) => value.trim().length > 0 || "Comment is required",
            })}
          />
          {errors.text && <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>}
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">Could not post your comment. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-sm bg-brand px-6 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const {
    data: product,
    isLoading: loading,
    isError: error,
  } = useQuery({ queryKey: ["product", id], queryFn: () => fetchProduct(id) });
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm bg-white p-8 text-center text-red-600 shadow-sm">
        Failed to load product.
      </div>
    );
  }

  if (!product) return null;

  const image = getProductImage(product);

  return (
    <div className="rounded-sm bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:gap-10 md:p-8">
        <div className="flex flex-1 items-center justify-center border-b pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
          {image ? (
            <img
              src={image}
              alt={product.title}
              className="max-h-80 max-w-full object-contain"
            />
          ) : (
            <div className="h-64 w-full rounded bg-gray-100" />
          )}
        </div>

        <div className="flex-1">
          <h1 className="mb-3 text-xl font-medium text-gray-900 md:text-2xl">{product.title}</h1>

          <div className="mb-4 text-3xl font-medium text-gray-900">{formatPrice(product.price)}</div>

          {product.description && (
            <p className="mb-6 text-sm leading-relaxed text-gray-600">{product.description}</p>
          )}

          {product.category?.name && (
            <div className="mb-6 inline-block rounded bg-cream px-3 py-2 text-sm">
              <span className="text-gray-500">Category</span>
              <p className="font-medium capitalize">{product.category.name}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-sm bg-deal px-10 py-3 text-sm font-medium text-white shadow transition hover:bg-deal-dark"
            >
              ADD TO CART
            </button>
            <Link
              to="/cart"
              onClick={() => addToCart(product)}
              className="rounded-sm bg-deal/90 px-10 py-3 text-sm font-medium text-white shadow transition hover:bg-deal-dark"
            >
              BUY NOW
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <CommentsSection productId={id} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
