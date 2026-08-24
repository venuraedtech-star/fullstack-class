const REQUIRED_ADDRESS_FIELDS = ["fullName", "addressLine", "city", "state", "zip", "phone"];

function validateOrder(req, res, next) {
  const { items, totalAmount, address, paymentMethod } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items is required and must be a non-empty array" });
  }

  for (const item of items) {
    if (
      typeof item.productId !== "number" ||
      typeof item.title !== "string" ||
      !item.title.trim() ||
      typeof item.price !== "number" ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0
    ) {
      return res.status(400).json({
        error: "each item requires productId (number), title (string), price (number), and quantity (number > 0)",
      });
    }
  }

  if (typeof totalAmount !== "number" || totalAmount <= 0) {
    return res.status(400).json({ error: "totalAmount is required and must be a number greater than 0" });
  }

  if (!address || typeof address !== "object") {
    return res.status(400).json({ error: "address is required" });
  }

  for (const field of REQUIRED_ADDRESS_FIELDS) {
    if (typeof address[field] !== "string" || !address[field].trim()) {
      return res.status(400).json({ error: `address.${field} is required` });
    }
  }

  if (typeof paymentMethod !== "string" || !paymentMethod.trim()) {
    return res.status(400).json({ error: "paymentMethod is required" });
  }

  next();
}

module.exports = validateOrder;
