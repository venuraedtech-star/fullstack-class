export function getMrp(price, discountPercentage = 0) {
  if (!discountPercentage) return Math.round(price);
  return Math.round(price / (1 - discountPercentage / 100));
}

export function formatPrice(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

const API_BASE = "http://localhost:3000";

export function getProductImage(product) {
  // dummyjson products carry full https:// URLs in images[]/thumbnail.
  // Our own backend's imageUrl is either a full URL (seed data) or a
  // relative /uploads/... path (newly uploaded via multer) that needs the
  // API's own origin prefixed, since the frontend runs on a different port.
  const url = product.images?.[0] ?? product.thumbnail ?? product.imageUrl ?? "";
  return url.startsWith("/") ? `${API_BASE}${url}` : url;
}
