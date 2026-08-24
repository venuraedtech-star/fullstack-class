export function getMrp(price, discountPercentage = 0) {
  if (!discountPercentage) return Math.round(price);
  return Math.round(price / (1 - discountPercentage / 100));
}

export function formatPrice(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function getProductImage(product) {
  return product.images?.[0] ?? product.thumbnail ?? "";
}
