import { useMemo, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Pagination,
  Typography,
} from "@mui/material";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import ProductGrid from "../components/ProductGrid";

const PAGE_SIZE = 12;

const SORT_OPTIONS = {
  "title-asc": { sortBy: "title", order: "asc" },
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
};

function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortValue, setSortValue] = useState("title-asc");
  const [page, setPage] = useState(1);

  const { data: categories } = useFetch("https://dummyjson.com/products/categories");
  const { addToCart } = useCart();

  const productsUrl = useMemo(() => {
    const base = selectedCategory
      ? `https://dummyjson.com/products/category/${selectedCategory}`
      : "https://dummyjson.com/products";
    const { sortBy, order } = SORT_OPTIONS[sortValue];
    const skip = (page - 1) * PAGE_SIZE;
    return `${base}?limit=${PAGE_SIZE}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
  }, [selectedCategory, sortValue, page]);

  const { data, loading, error } = useFetch(productsUrl);

  function handleSelectCategory(slug) {
    setSelectedCategory(slug);
    setPage(1);
  }

  function handleSortChange(_e, newValue) {
    setSortValue(newValue);
    setPage(1);
  }

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
      <Box sx={{ width: { xs: "100%", sm: 220 }, flexShrink: 0 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, px: 2 }}>
          Categories
        </Typography>
        <List dense>
          <ListItemButton
            selected={selectedCategory === null}
            onClick={() => handleSelectCategory(null)}
          >
            <ListItemText primary="All Categories" />
          </ListItemButton>
          {categories?.map((category) => (
            <ListItemButton
              key={category.slug}
              selected={selectedCategory === category.slug}
              onClick={() => handleSelectCategory(category.slug)}
            >
              <ListItemText primary={category.name} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Tabs value={sortValue} onChange={handleSortChange} sx={{ mb: 3 }}>
          <Tab value="title-asc" label="Name (A-Z)" />
          <Tab value="price-asc" label="Price: Low to High" />
          <Tab value="price-desc" label="Price: High to Low" />
        </Tabs>

        {loading && <Typography>Loading products....</Typography>}
        {error && <Typography color="error">Error: Failed to fetch products...</Typography>}

        {data && (
          <>
            <ProductGrid products={data.products} onAdd={addToCart} />
            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_e, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default CategoriesPage;
