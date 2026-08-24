import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import StaticPage from "../components/StaticPage";
import { ProfileIcon } from "../components/StaticPageIcons";

function ProfilePage() {
  const { user } = useAuth();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })
    : null;

  return (
    <StaticPage
      title="My Profile"
      subtitle="Your account details."
      Icon={ProfileIcon}
      gradient="from-brand to-brand-dark"
      aside={
        user?.role === "admin" && (
          <div className="rounded-sm bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">Admin Access</h2>
            <p className="mb-4 text-sm text-gray-600">
              Your account has admin privileges — you can manage products, categories, and
              orders.
            </p>
            <Link
              to="/admin"
              className="inline-block text-sm font-medium text-brand hover:underline"
            >
              Go to Admin Dashboard →
            </Link>
          </div>
        )
      }
    >
      <dl className="divide-y divide-gray-100">
        <div className="flex items-center justify-between py-3 first:pt-0">
          <dt className="text-gray-500">Name</dt>
          <dd className="font-medium text-gray-900">{user?.name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-gray-500">Email</dt>
          <dd className="font-medium text-gray-900">{user?.email}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-gray-500">Account type</dt>
          <dd className="font-medium capitalize text-gray-900">{user?.role}</dd>
        </div>
        {memberSince && (
          <div className="flex items-center justify-between py-3 last:pb-0">
            <dt className="text-gray-500">Member since</dt>
            <dd className="font-medium text-gray-900">{memberSince}</dd>
          </div>
        )}
      </dl>
    </StaticPage>
  );
}

export default ProfilePage;
