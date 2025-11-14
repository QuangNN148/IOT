// Sidebar Component - Menu điều hướng
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/data', label: 'Data Sensors', icon: '📊' },
    { path: '/actions', label: 'Action History', icon: '📝' },
    { path: '/dashboard', label: 'Dashboard', icon: '📈' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-sidebar shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">☀️</div>
          <div>
            <h1 className="text-xl font-bold text-blue-900">IoT Dashboard</h1>
            <p className="text-xs text-blue-600">Monitoring System</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-blue-900 hover:bg-blue-200'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-200">
        <p className="text-xs text-blue-600 text-center">
          © 2025 IoT Project
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
