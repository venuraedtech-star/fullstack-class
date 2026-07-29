import { useState, useMemo } from "react";
import "./App.css";
// import products from "./data/products";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import NewsletterForm from "./components/NewsletterForm";
import useFetch from "./hooks/useFetch";

function App() {
  const {
    data: products,
    loading,
    error,
  } = useFetch("https://dummyjson.com/products?limit=194");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  function handleAddtoCart(product) {
    setCart([...cart, product]);
    console.log(cart);
  }

  const filteredProducts = useMemo(() => {
    console.log(products);
    if (!products) return [];
    return products.products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  if (loading) return <p>Loading products....</p>;
  if (error) return <p>Error: Failed to Fetch products...</p>;
  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <Header cartCount={cart.length} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <ProductGrid products={filteredProducts} onAdd={handleAddtoCart} />
      <NewsletterForm />
    </div>
  );
}

export default App;
