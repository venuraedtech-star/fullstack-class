import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import Footer from "./Footer";
import ProfileMenu from "./ProfileMenu";

const SEARCH_DEBOUNCE_MS = 400;

function Layout() {
  const { isLoggedIn } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  // Live search-as-you-type: wait for a pause in typing before navigating,
  // so every keystroke doesn't trigger its own fetch/navigation. Comparing
  // against the URL's current `q` (rather than a "have I run yet" ref) means
  // this is a no-op whenever there's nothing to change — including on mount,
  // and correctly even under StrictMode's dev-mode double effect invocation.
  useEffect(() => {
    const query = searchTerm.trim();
    const currentQuery = searchParams.get("q") ?? "";
    if (query === currentQuery) return;

    const timer = setTimeout(() => {
      navigate(query ? `/?q=${encodeURIComponent(query)}` : "/", { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm, navigate, searchParams]);

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 bg-brand shadow-md">
        <div className="mx-auto flex max-w-[1248px] items-center gap-6 px-4 py-2">
          <Link to="/" className="flex shrink-0 flex-col leading-none">
            <span className="text-2xl font-bold italic text-white">
              Cart<span className="text-accent">loom</span>
            </span>
            <span className="text-[10px] text-accent italic">Explore Plus</span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-md items-center overflow-hidden rounded-sm border border-transparent bg-white transition-colors hover:border-accent focus-within:border-accent"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full px-3 py-1.5 text-sm text-gray-800 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-brand transition hover:bg-gray-50"
              aria-label="Search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <nav className="ml-auto hidden items-center gap-6 md:flex">
            {isLoggedIn ? (
              <ProfileMenu />
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
                <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-brand">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="hidden border-t border-white/10 bg-brand md:block">
          <div className="mx-auto flex max-w-[1248px] items-center gap-8 px-4 py-2 text-sm font-medium text-white">
            <NavLink to="/categories" className="flex items-center gap-1 hover:text-accent">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              All Categories
            </NavLink>
            <Link to="/categories?cat=smartphones" className="hover:text-accent">Mobiles</Link>
            <Link to="/categories?cat=laptops" className="hover:text-accent">Electronics</Link>
            <Link to="/categories?cat=furniture" className="hover:text-accent">Home</Link>
            <Link to="/categories?cat=beauty" className="hover:text-accent">Beauty</Link>
            <Link to="/categories?cat=mens-shirts" className="hover:text-accent">Fashion</Link>
            <Link to="/categories?cat=groceries" className="hover:text-accent">Grocery</Link>
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
