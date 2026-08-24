import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-auto bg-gray-50 p-6 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
