import { Home, Users, Settings, LogOut, User2Icon } from 'lucide-react';
import { NavLink } from 'react-router-dom';


export default function Sidebar() {
  const menu = [
    { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
    { name: 'User Management', icon: <User2Icon size={18} />, path: '/users' },
    { name: 'Team Management', icon: <Users size={18} />, path: '/teams' },

  ];

  return (
    <div className="w-64 min-h-screen bg-[#3F2E60] text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-8">LOGO</h1>

        <p className="text-xs text-gray-300 uppercase mb-3">Main Menu</p>

        <div className="flex flex-col gap-2">
          {menu.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
            className={({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer 
   ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
}

            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        <p className="text-xs text-gray-300 uppercase mt-6 mb-2">Settings</p>

        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >
          <Settings size={18} /> Settings
        </NavLink>
      </div>

      <button className="flex items-center gap-2 text-red-300">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
