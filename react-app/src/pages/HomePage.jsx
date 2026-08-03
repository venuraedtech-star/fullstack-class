import { useState, useMemo } from "react";
import { Typography } from "@mui/material";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import NewsletterForm from "../components/NewsletterForm";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: products,
    loading,
    error,
  } = useFetch("https://dummyjson.com/products?limit=194");
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  if (loading) return <Typography>Loading products....</Typography>;
  if (error) return <Typography color="error">Error: Failed to Fetch products...</Typography>;

  return (
    <>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <ProductGrid products={filteredProducts} onAdd={addToCart} />
      <NewsletterForm />
    </>
  );
}

export default HomePage;
