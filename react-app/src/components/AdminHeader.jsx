import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import useCart from "../hooks/useCart";
import ProfileMenu from "./ProfileMenu";

function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminHeader() {
  const { darkMode, toggleTheme } = useTheme();
  const { cartCount } = useCart();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-brand px-4 shadow-md">
      <Link to="/" className="flex shrink-0 flex-col leading-none">
        <span className="text-xl font-bold italic text-white">
          Cart<span className="text-accent">loom</span>
        </span>
        <span className="text-[10px] italic text-accent">Admin</span>
      </Link>

      <div className="flex items-center gap-3">
        <ProfileMenu />

        <Link
          to="/cart"
          aria-label="Cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10">
          <CartIcon className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-brand">
              {cartCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10">
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
