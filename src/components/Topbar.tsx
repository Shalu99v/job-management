import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const { pathname } = useLocation();

  // Map routes to titles
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/users': 'Jobs Management',
    '/teams': 'Team Management',
    '/settings': 'Settings',
  };

  // Pick title based on current route, fallback to empty
  const pageTitle = titles[pathname] || '';

  return (
    <div className="w-full flex justify-between items-center px-6 py-3 shadow bg-white">
      {/* LEFT SIDE TITLE */}
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
      <div className="flex items-center gap-8">
        <div className='bg-[#DADADA] p-2 rounded-full relative'>
        <Bell size={20}/>
<div className='w-2 h-2 rounded-full bg-green-600 absolute right-0 top-[4px]'></div>
        </div>
        {/* RIGHT SIDE PROFILE */}
        <img
          src="https://i.pravatar.cc/50"
          alt="user"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
