import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import Footer from "./Footer";

function Layout() {
  const { isLoggedIn, logout, user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      navigate(`/?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-flip-bg">
      <header className="sticky top-0 z-50 bg-flip-blue shadow-md">
        <div className="mx-auto flex max-w-[1248px] items-center gap-6 px-4 py-2">
          <Link to="/" className="flex shrink-0 flex-col leading-none">
            <span className="text-2xl font-bold italic text-white">
              Cart<span className="text-flip-yellow">loom</span>
            </span>
            <span className="text-[10px] text-flip-yellow italic">Explore Plus</span>
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full rounded-l-sm px-4 py-2.5 text-sm text-gray-800 outline-none"
            />
            <button
              type="submit"
              className="rounded-r-sm bg-white px-5 py-2.5 text-flip-blue transition hover:bg-gray-50"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <nav className="hidden items-center gap-6 md:flex">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">{user?.name ?? "User"}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm font-medium text-white hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-white hover:underline">
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-1 text-sm font-medium text-white hover:underline"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-flip-yellow text-xs font-bold text-flip-blue">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/admin" className="text-sm font-medium text-white hover:underline">
              Admin
            </Link>
          </nav>
        </div>

        <div className="hidden border-t border-white/10 bg-flip-blue md:block">
          <div className="mx-auto flex max-w-[1248px] items-center gap-8 px-4 py-2 text-sm font-medium text-white">
            <NavLink to="/categories" className="flex items-center gap-1 hover:text-flip-yellow">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              All Categories
            </NavLink>
            <Link to="/categories?cat=smartphones" className="hover:text-flip-yellow">Mobiles</Link>
            <Link to="/categories?cat=laptops" className="hover:text-flip-yellow">Electronics</Link>
            <Link to="/categories?cat=furniture" className="hover:text-flip-yellow">Home</Link>
            <Link to="/categories?cat=beauty" className="hover:text-flip-yellow">Beauty</Link>
            <Link to="/categories?cat=mens-shirts" className="hover:text-flip-yellow">Fashion</Link>
            <Link to="/categories?cat=groceries" className="hover:text-flip-yellow">Grocery</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1248px] px-4 py-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
