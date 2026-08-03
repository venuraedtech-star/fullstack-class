import { Grid, Typography } from "@mui/material";
import { ProductCard } from "./ProductCard";

function ProductGrid({ products, onAdd }) {
  if (products.length === 0) {
    return (
      <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
        No products found. Try a different search
      </Typography>
    );
  }
  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ProductCard
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.images[0]}
            category={product.category}
            onAdd={() => onAdd(product)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductGrid;
