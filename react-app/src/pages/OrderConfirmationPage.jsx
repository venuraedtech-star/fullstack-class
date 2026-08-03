import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function OrderConfirmationPage() {
  const location = useLocation();
  const total = location.state?.total;

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Order placed successfully!
      </Typography>
      {typeof total === "number" && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Total charged: ${total.toFixed(2)}
        </Typography>
      )}
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Continue Shopping
      </Button>
    </Box>
  );
}

export default OrderConfirmationPage;
