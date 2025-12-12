import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen ">
        <Topbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
