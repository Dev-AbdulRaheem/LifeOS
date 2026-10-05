import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useClickOutside } from '../../hooks/useClickOutside';

import NotificationPanel from '../notifications/NotificationPanel';

export default function Topbar({ onMenuClick, onSearchOpen }) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const { logout } = useAuth();
  const { notifications, profile } = useAppData();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userMenuRef = useClickOutside(() => setShowUserMenu(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800
      flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-gray-100
            dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700
            transition-colors w-48 lg:w-64"
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="hidden sm:inline-block ml-auto text-xs bg-gray-200 dark:bg-gray-700
            px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Right: notifications, theme, user */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500
            transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
              text-gray-500 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs
                rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100
              dark:hover:bg-gray-800 transition-colors"
            aria-label="User menu"
          >
            {profile?.avatar ? (
              <img src={profile.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{initials}</span>
              </div>
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border
              border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-1 z-50">
              <button
                onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700
                  dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700
                  dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <hr className="my-1 border-gray-200 dark:border-gray-800" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600
                  dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
