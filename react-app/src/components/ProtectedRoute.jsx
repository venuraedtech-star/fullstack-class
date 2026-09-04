import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;

  // The backend already rejects a non-admin's admin-only requests (see
  // authorize("admin") in the API routes) — this just stops a logged-in
  // customer from landing on the admin shell in the first place, where
  // most of it would silently fail or 403 instead of never being shown.
  if (requireAdmin && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
