import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";

function ProductDetailPage() {
  const { id } = useParams();
  const {
    data: product,
    loading,
    error,
  } = useFetch(`https://dummyjson.com/products/${id}`);
  const { addToCart } = useCart();

  if (loading) return <Typography>Loading product....</Typography>;
  if (error) return <Typography color="error">Error: Failed to fetch product...</Typography>;
  if (!product) return null;

  return (
    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      <Box
        component="img"
        src={product.images[0]}
        alt={product.title}
        sx={{ width: 320, maxWidth: "100%", objectFit: "contain", bgcolor: "action.hover", borderRadius: 2, p: 2 }}
      />
      <Box sx={{ flex: 1, minWidth: 240 }}>
        <Typography variant="h4" gutterBottom>
          {product.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          ${product.price}
        </Typography>
        <Button variant="contained" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
}

export default ProductDetailPage;
