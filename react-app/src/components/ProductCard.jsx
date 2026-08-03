import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, CardActions, Typography, Button } from "@mui/material";

export function ProductCard({ id, title, price, image, category, onAdd }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ height: 160, objectFit: "contain", bgcolor: "action.hover", p: 2 }}
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
            {category}
          </Typography>
        </CardContent>
      </Link>
      <CardActions sx={{ mt: "auto", justifyContent: "space-between", px: 2, pb: 2 }}>
        <Typography variant="body1" fontWeight={500}>
          ${price}
        </Typography>
        <Button variant="contained" size="small" onClick={onAdd}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
