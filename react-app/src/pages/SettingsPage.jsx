import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

function SettingsPage() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your account and preferences.
        </p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Account</h2>
        <dl className="divide-y divide-gray-100 dark:divide-gray-800">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Name</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Role</dt>
            <dd className="text-sm font-medium capitalize text-gray-900 dark:text-gray-100">
              {user.role}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark across the whole app.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={toggleTheme}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              darkMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
            }`}>
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                darkMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
