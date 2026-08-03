import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import useCart from "../hooks/useCart";

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

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleAddressChange(field) {
    return (e) => setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleCardChange(field) {
    return (e) => setCard((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearCart();
    navigate("/order-confirmation", { state: { total: cartTotal } });
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Card>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Shipping Address</Typography>
            <TextField label="Full Name" required value={address.fullName} onChange={handleAddressChange("fullName")} />
            <TextField label="Address Line" required value={address.addressLine} onChange={handleAddressChange("addressLine")} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="City" required fullWidth value={address.city} onChange={handleAddressChange("city")} />
              <TextField label="State" required fullWidth value={address.state} onChange={handleAddressChange("state")} />
              <TextField label="ZIP" required fullWidth value={address.zip} onChange={handleAddressChange("zip")} />
            </Box>
            <TextField label="Phone" required value={address.phone} onChange={handleAddressChange("phone")} />
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Payment</Typography>
            <Typography variant="caption" color="text.secondary">
              Demo checkout — no real payment is processed.
            </Typography>
            <RadioGroup
              row
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="card" control={<Radio />} label="Card" />
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
            </RadioGroup>
            {paymentMethod === "card" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Card Number" required value={card.number} onChange={handleCardChange("number")} />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField label="Expiry (MM/YY)" required fullWidth value={card.expiry} onChange={handleCardChange("expiry")} />
                  <TextField label="CVV" required fullWidth value={card.cvv} onChange={handleCardChange("cvv")} />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ width: { xs: "100%", sm: 300 }, flexShrink: 0, height: "fit-content" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          {cart.map(({ product, quantity }) => (
            <Box key={product.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                {product.title} x{quantity}
              </Typography>
              <Typography variant="body2">${(product.price * quantity).toFixed(2)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="subtitle1">${cartTotal.toFixed(2)}</Typography>
          </Box>
          <Button type="submit" fullWidth variant="contained">
            Place Order
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CheckoutPage;
