import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import axiosInstance from "../api/axiosInstance";
import { formatPrice, getProductImage } from "../utils/productUtils";

function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [submitError, setSubmitError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleAddressChange(field) {
    return (event) => setAddress((prev) => ({ ...prev, [field]: event.target.value }));
  }

  function handleCardChange(field) {
    return (event) => setCard((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setIsPlacingOrder(true);
    try {
      const { data: order } = await axiosInstance.post("/orders", {
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity,
          imageUrl: getProductImage(product),
        })),
        totalAmount: cartTotal,
        address,
        paymentMethod,
      });
      clearCart();
      navigate("/order-confirmation", { state: { total: cartTotal, orderId: order.id } });
    } catch {
      setSubmitError("Could not place your order — make sure the API server is running (cd product-catalog-api && npm start).");
      setIsPlacingOrder(false);
    }
  }

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 space-y-4">
        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Delivery Address</h2>
          <div className="space-y-3">
            <input
              className={inputClass}
              placeholder="Full Name"
              required
              value={address.fullName}
              onChange={handleAddressChange("fullName")}
            />
            <input
              className={inputClass}
              placeholder="Address (Area and Street)"
              required
              value={address.addressLine}
              onChange={handleAddressChange("addressLine")}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                className={inputClass}
                placeholder="City"
                required
                value={address.city}
                onChange={handleAddressChange("city")}
              />
              <input
                className={inputClass}
                placeholder="State"
                required
                value={address.state}
                onChange={handleAddressChange("state")}
              />
              <input
                className={inputClass}
                placeholder="PIN Code"
                required
                value={address.zip}
                onChange={handleAddressChange("zip")}
              />
            </div>
            <input
              className={inputClass}
              placeholder="Phone Number"
              required
              value={address.phone}
              onChange={handleAddressChange("phone")}
            />
          </div>
        </div>

        <div className="rounded-sm bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-medium text-gray-800">Payment Options</h2>
          <p className="mb-4 text-xs text-gray-500">Demo checkout — no real payment is processed.</p>
          <div className="mb-4 flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="accent-brand"
              />
              Credit / Debit Card
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="accent-brand"
              />
              Cash on Delivery
            </label>
          </div>
          {paymentMethod === "card" && (
            <div className="space-y-3">
              <input
                className={inputClass}
                placeholder="Card Number"
                required
                value={card.number}
                onChange={handleCardChange("number")}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inputClass}
                  placeholder="Valid Thru (MM/YY)"
                  required
                  value={card.expiry}
                  onChange={handleCardChange("expiry")}
                />
                <input
                  className={inputClass}
                  placeholder="CVV"
                  required
                  value={card.cvv}
                  onChange={handleCardChange("cvv")}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-fit rounded-sm bg-white p-6 shadow-sm lg:w-80">
        <h2 className="mb-4 border-b pb-3 text-gray-500">ORDER SUMMARY</h2>
        <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-3">
              <img
                src={getProductImage(product)}
                alt=""
                className="h-12 w-12 object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-gray-700">{product.title}</p>
                <p className="text-xs text-gray-500">Qty: {quantity}</p>
              </div>
              <span className="text-sm">{formatPrice(product.price * quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed pt-4">
          <div className="mb-4 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          {submitError && (
            <p className="mb-3 text-sm text-red-600">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isPlacingOrder}
            className="w-full rounded-sm bg-deal py-3 text-sm font-medium text-white hover:bg-deal-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlacingOrder ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CheckoutPage;
