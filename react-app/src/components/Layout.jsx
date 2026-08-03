import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from "@mui/material";
import { Outlet, NavLink } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";

function Layout() {
  const { darkMode, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ShoppingBagIcon />
            Cartloom
          </Typography>

          <Button component={NavLink} to="/categories" color="inherit">
            Categories
          </Button>

          <Button component={NavLink} to="/admin" color="inherit">
            Admin
          </Button>

          {isLoggedIn ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button component={NavLink} to="/login" color="inherit">
              Login
            </Button>
          )}

          <IconButton color="inherit" onClick={toggleTheme}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton component={NavLink} to="/cart" color="inherit" sx={{ ml: 1 }}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ width: "100%", px: { xs: 2, sm: 4 }, py: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
