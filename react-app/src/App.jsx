import { useState } from "react";
import "./App.css";
import products from "./data/products";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import NewsletterForm from "./components/NewsletterForm";

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  function handleAddtoCart(product) {
    console.log(product);
    setCart([...cart, product]);
    console.log(cart);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
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

//Event Handling in React

// condition ? true : false
