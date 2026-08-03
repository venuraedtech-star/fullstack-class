import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import useCart from "../hooks/useCart";

function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" gutterBottom>
          Your cart is empty
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {cart.map(({ product, quantity }) => (
          <Card key={product.id} sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
            <Box
              component="img"
              src={product.images[0]}
              alt={product.title}
              sx={{ width: 72, height: 72, objectFit: "contain", bgcolor: "action.hover", borderRadius: 1 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${product.price} each
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small" onClick={() => updateQuantity(product.id, quantity - 1)}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 20, textAlign: "center" }}>{quantity}</Typography>
              <IconButton size="small" onClick={() => updateQuantity(product.id, quantity + 1)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle1" sx={{ minWidth: 70, textAlign: "right" }}>
              ${(product.price * quantity).toFixed(2)}
            </Typography>
            <IconButton onClick={() => removeFromCart(product.id)} aria-label="Remove item">
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
      </Box>

      <Card sx={{ width: { xs: "100%", sm: 300 }, flexShrink: 0, height: "fit-content" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>${cartTotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Shipping</Typography>
            <Typography>Free</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="subtitle1">${cartTotal.toFixed(2)}</Typography>
          </Box>
          <Button fullWidth variant="contained" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CartPage;
