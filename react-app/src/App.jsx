import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshOnLoad } from "./store/authSlice";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AuthLayout from "./components/AuthLayout";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OverviewPage from "./pages/OverviewPage";
import AdminPage from "./pages/AdminPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import PaymentsPage from "./pages/PaymentsPage";
import ShippingPage from "./pages/ShippingPage";
import ReturnsPage from "./pages/ReturnsPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfilePage from "./pages/ProfilePage";

// Access tokens expire after 15 minutes (see authController.js signToken).
// Re-running the same silent-refresh thunk on this interval keeps an active
// session's token from ever going stale, and — just as importantly — is
// what notices a refresh token that's expired or been revoked while the
// user was only ever browsing public pages (no request ever 401s in that
// case, since nothing protected gets called, so the reactive axios
// interceptor in api/axiosInstance.js never fires and the header would
// otherwise keep showing a "logged in" user with a dead session).
const SESSION_CHECK_INTERVAL_MS = 10 * 60 * 1000;

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.user);

  useEffect(() => {
    dispatch(refreshOnLoad());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const interval = setInterval(() => {
      dispatch(refreshOnLoad());
    }, SESSION_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch, isLoggedIn]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="return-policy" element={<ReturnPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
      </Route>

      {/* Standalone admin dashboard — owns its own full-page header, no storefront Layout. */}
      <Route
        path="admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="products" element={<AdminPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Standalone auth pages — no storefront header, split-screen layout. */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
