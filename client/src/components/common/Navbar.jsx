import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header>
      {/* Main Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              STORE
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link to="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-700 hover:text-gray-900">
                <Search className="w-6 h-6" />
              </button>
              <Link to="/cart" className="relative text-gray-700 hover:text-gray-900">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  0
                </span>
              </Link>
              <Link to="/auth/login" className="text-gray-700 hover:text-gray-900">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;