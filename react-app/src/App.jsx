import { useState } from "react";
import "./App.css";
import { ProductCard } from "./components/ProductCard";

const products = [
  {
    id: 1,
    name: "Everyday Backpack",
    price: 109.95,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "2TB External Drive",
    price: 64.0,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "1TB Internal SSD",
    price: 109.0,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "4TB Gaming Drive",
    price: 114.0,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Slim Laptop",
    price: 606.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: '49" Curved Monitor',
    price: 999.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
  },
];

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
    <div className="catalog">
      <div className="catalog-header">
        <div>
          <h1>Product Catalog</h1>
          <p className="catalog-subtitle">{products.length} products</p>
        </div>
        <div className="cart-badge">Cart ({cart.length})</div>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search Products..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            category={product.category}
            onAdd={() => handleAddtoCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
