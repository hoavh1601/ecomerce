import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  Settings,
  BarChart2
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: Users
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: ShoppingBag
    },
    {
      title: 'Categories',
      path: '/admin/categories',
      icon: FileText
    },
    {
      title: 'Statistics',
      path: '/admin/statistics',
      icon: BarChart2
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: Settings
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen">
      {/* Sidebar Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                isActive(item.path) ? 'bg-gray-800 text-white border-l-4 border-blue-500' : ''
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;