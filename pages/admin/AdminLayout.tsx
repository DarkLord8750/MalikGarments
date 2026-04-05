import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, LogOut, Settings, FolderTree, Activity } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AdminLayout() {
  const { isAdmin, logoutAdmin } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) {
    // Basic redirect protection
    setTimeout(() => navigate('/admin/login'), 0);
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { path: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
    { path: '/admin/activity', icon: Activity, label: 'Activity Logs' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col fixed h-full shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
              <p className="text-xs text-gray-400">MalikGarments</p>
            </div>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all duration-200 font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}