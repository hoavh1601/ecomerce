import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";

const SellerSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/seller",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      path: "/seller/products",
      icon: Package,
    },
    {
      title: "Orders",
      path: "/seller/orders",
      icon: ShoppingBag,
    },
    {
      title: "Sales",
      path: "/seller/sales",
      icon: TrendingUp,
    },
    {
      title: "Reports",
      path: "/seller/reports",
      icon: FileText,
    },
    {
      title: "Settings",
      path: "/seller/settings",
      icon: Settings,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen border-r">
      {/* Sidebar Header */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Seller Dashboard</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;
