import { useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { CartContext } from "./cartContext";

function isValidLine(line) {
  return Boolean(line && line.product && typeof line.quantity === "number");
}

export function CartProvider({ children }) {
  const [rawCart, setCart] = useLocalStorage("cart", []);
  const cart = useMemo(() => rawCart.filter(isValidLine), [rawCart]);

  function addToCart(product) {
    setCart((prev) => {
      const valid = prev.filter(isValidLine);
      const existing = valid.find((line) => line.product.id === product.id);
      if (existing) {
        return valid.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...valid, { product, quantity: 1 }];
    });
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev
        .filter(isValidLine)
        .map((line) => (line.product.id === id ? { ...line, quantity } : line)),
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter(isValidLine).filter((line) => line.product.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [cart],
  );

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
