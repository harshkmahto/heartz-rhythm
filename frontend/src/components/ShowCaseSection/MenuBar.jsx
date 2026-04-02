import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShoppingBag, LayoutDashboard, Home, Sun, Moon, Heart, ShoppingCart, Package, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();

  const mainMenuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/about', label: 'About', icon: Heart },
    { path: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const profileMenuItems = [
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/orders', label: 'My Orders', icon: Package },
    { path: '/cart', label: 'My Cart', icon: ShoppingCart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-60 sm:w-76 bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header with Heart Rhythm */}
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="text-white" size={28} fill="white" />
                  <h2 className="text-2xl font-bold italic text-white tracking-tighter">
                    Heart Rhythm
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-2">Find your perfect rhythm</p>
            </div>

            {/* Theme Toggle Switch */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Moon size={22} className="text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <Sun size={22} className="text-neutral-600 dark:text-neutral-400" />
                  )}
                  <span className="font-headline font-medium text-neutral-700 dark:text-neutral-300">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                
                {/* Toggle Switch */}
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  style={{
                    backgroundColor: isDark ? '#ef4444' : '#e5e7eb'
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Main Menu Section */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 mb-3">
                Main Menu
              </h3>
              <div className="flex flex-col gap-1">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-neutral-50 transition-all duration-200 group"
                    >
                      <div className="w-8">
                        <Icon size={20} className="group-hover:scale-110 transition-transform group-hover:text-red-500" />
                      </div>
                      <span className="font-headline font-medium text-base">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-4 mb-3">
                Account
              </h3>
              <div className="flex flex-col gap-1">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-neutral-50 transition-all duration-200 group"
                    >
                      <div className="w-8">
                        <Icon size={20} className="group-hover:scale-110 transition-transform group-hover:text-red-500" />
                      </div>
                      <span className="font-headline font-medium text-base">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4">
              <button
                onClick={() => {
                  // Add your logout logic here
                  console.log('Logout clicked');
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-headline font-medium text-base">Logout</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 mt-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                © 2024 Heart Rhythm. All rights reserved.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;