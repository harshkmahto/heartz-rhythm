import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Users, 
  LogOut,
  Sun,
  Moon,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  TrendingUp,
  Tag,
  Truck,
  DollarSign,
  Star,
  Heart,
  Zap,
  Award,
  Shield,
  Grid3x3,
  List,
  ChevronDown,
  MessageCircle,
  Clock,
  Plus,
  Database,
  Activity,
  FileText,
  Crown,
  AlertCircle,
  Flame,
  ShieldBanIcon,
  Trash,
  IndianRupee
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const {isAuthenticated, user, logout } = useAuth();
  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside or on a link
  const handleMobileMenuClose = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Main navigation items for admin sidebar
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true, section: 'dashboard' },
    { name: 'Users', path: '/admin/users', icon: Users, section: 'users',
      subItems: [
        { name: 'All Users', path: '/admin/users/all', icon: Users },
        { name: 'Sellers', path: '/admin/users/sellers', icon: Crown },
        { name: 'Blocked', path: '/admin/users/blocked', icon: ShieldBanIcon },
        { name: 'Verification', path: '/admin/users/verification', icon: Shield },
        { name: 'User Status', path: '/admin/users/status', icon: Star },
        { name: 'User Bin', path: '/admin/users/bin', icon: Trash }
      ]
    },
    { name: 'Products', path: '/admin/products', icon: Package, section: 'products',
      subItems: [
        { name: 'All Products', path: '/admin/products/all', icon: Grid3x3 },
        { name: 'Price Updation', path: '/admin/products/price-update', icon: IndianRupee },
        { name: 'Reported Items', path: '/admin/products/report', icon: AlertCircle },
        
      ]
    },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart, section: 'orders', badge: '342',
      subItems: [
        { name: 'All Orders', path: '/admin/orders/all', icon: List },
        { name: 'Pending', path: '/admin/orders/pending', icon: Clock },
        { name: 'Processing', path: '/admin/orders/processing', icon: Truck },
        { name: 'Completed', path: '/admin/orders/completed', icon: Award },
        { name: 'Refunds', path: '/admin/orders/refunds', icon: DollarSign }
      ]
    },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3, section: 'analytics',
      subItems: [
        { name: 'Overview', path: '/admin/analytics/overview', icon: TrendingUp },
        { name: 'Revenue', path: '/admin/analytics/revenue', icon: DollarSign },
        { name: 'User Activity', path: '/admin/analytics/activity', icon: Activity },
        { name: 'Reports', path: '/admin/analytics/reports', icon: FileText }
      ]
    },
    { name: 'System', path: '/admin/system', icon: Database, section: 'system',
      subItems: [
        { name: 'Storage', path: '/admin/system/storage', icon: Database },
        { name: 'Logs', path: '/admin/system/logs', icon: FileText },
        { name: 'Backup', path: '/admin/system/backup', icon: Shield }
      ]
    },
    { name: 'Settings', path: '/admin/settings', icon: Settings, section: 'settings' }
  ];

  // Quick actions for right panel
  const quickActions = [
    { name: 'Add Admin', icon: User, color: 'red', action: () => navigate('/admin/users/add') },
    { name: 'View Reports', icon: FileText, color: 'red', action: () => navigate('/admin/analytics/reports') },
    { name: 'System Health', icon: Activity, color: 'red', action: () => navigate('/admin/system') },
    { name: 'Manage Users', icon: Users, color: 'red', action: () => navigate('/admin/users') }
  ];


  if(!isAuthenticated && user.role==='admin' ) {
    return null;
  }   

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:bg-black">
      <div className="flex h-screen overflow-hidden">
        
        {/* Left Sidebar - Red/Black Theme */}
        <aside 
          className={`
            fixed lg:relative z-30 h-full transition-all duration-500 ease-out
            ${isMobile 
              ? (isMobileMenuOpen ? 'w-[60%] sm:w-[280px]' : 'w-0') 
              : (isSidebarOpen ? 'w-60' : 'w-20')
            }
            ${isMobile && !isMobileMenuOpen ? 'invisible' : 'visible'}
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            bg-white/95 backdrop-blur-xl border-r border-red-200/50 shadow-2xl shadow-red-500/10
            dark:bg-black/95 dark:backdrop-blur-xl dark:border-r dark:border-red-500/30 dark:shadow-2xl dark:shadow-red-500/20
            overflow-hidden
          `}
        >
          {/* Sidebar Header */}
          <div className="relative overflow-hidden">
            <div className="flex items-center justify-between h-20 px-5 border-b border-red-200/50 bg-gradient-to-r from-red-50/80 via-white to-red-50/30 dark:border-red-500/30 dark:bg-gradient-to-r dark:from-red-950/50 dark:via-black dark:to-red-950/30">
              {(!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen) ? (
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 dark:bg-gradient-to-br dark:from-red-600 dark:to-red-800">
                      <Flame className="w-5 h-5 text-white animate-pulse" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-red-500 dark:to-red-300">
                      HEARTZ RHYTHM
                    </span>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70">Admin Console</p>
                  </div>
                </div>
              ) : (!isMobile && !isSidebarOpen) && (
                <div className="relative w-10 h-10 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl blur-lg animate-pulse dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center dark:bg-gradient-to-br dark:from-red-600 dark:to-red-800">
                    <Flame className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>
              )}
              
              {!isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden lg:flex p-2 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-110 hover:rotate-180 dark:hover:bg-red-900/30"
                >
                  {isSidebarOpen ? 
                    <ChevronLeft className="w-5 h-5 text-red-600 dark:text-red-400" /> : 
                    <ChevronRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  }
                </button>
              )}
              
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Red Glow Animation Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 bg-white/50 dark:bg-black/50">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={() => {
                    setActiveSection(item.section);
                    if (isMobile) handleMobileMenuClose();
                  }}
                  className={({ isActive }) => `
                    relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300
                    ${(!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen) ? 'justify-start' : 'justify-center'}
                    ${isActive 
                      ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30 scale-[1.02] dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800' 
                      : 'text-gray-700 hover:bg-red-50/80 hover:text-red-600 hover:scale-[1.02] hover:shadow-md dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${(!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen) ? '' : 'mx-auto'} group-hover:scale-110`} />
                  {((!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen)) && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full shadow-sm animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
                
                {/* SubItems */}
                {((!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen)) && item.subItems && (
                  <div className="ml-12 mt-2 space-y-1 border-l-2 border-red-200/50 pl-3 dark:border-red-500/30">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => isMobile && handleMobileMenuClose()}
                        className={({ isActive }) => `
                          flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'text-red-600 font-semibold bg-red-50/80 dark:text-red-400 dark:bg-red-950/50' 
                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50/50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-950/30'
                          }
                        `}
                      >
                        <subItem.icon className="w-3.5 h-3.5" />
                        <span>{subItem.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {((!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen)) && (
            <div className="border-t border-red-200/50 p-4 bg-gradient-to-t from-red-50/20 to-transparent dark:border-red-500/30 dark:bg-gradient-to-t dark:from-red-950/20 dark:to-transparent">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-300 group justify-start dark:hover:bg-red-950/50"
              >
                <LogOut className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
          
          {/* Compact footer for desktop collapsed state */}
          {!isMobile && !isSidebarOpen && (
            <div className="border-t border-red-200/50 p-4 bg-gradient-to-t from-red-50/20 to-transparent dark:border-red-500/30 dark:bg-gradient-to-t dark:from-red-950/20 dark:to-transparent">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full p-2 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-300 group dark:hover:bg-red-950/50"
              >
                <LogOut className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              </button>
            </div>
          )}
        </aside>

        {/* Mobile Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Red/Black Theme */}
          <header className="relative bg-white/80 backdrop-blur-xl border-b border-red-200/50 shadow-sm dark:bg-black/80 dark:backdrop-blur-xl dark:border-b dark:border-red-500/30">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse"></div>
            
            <div className="flex items-center justify-between gap-20 mx-10 px-4 md:px-6 h-16 lg:h-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-110 dark:hover:bg-red-900/30"
                >
                  <Menu className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
                <div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-500">Admin Panel</p>
                </div>
                
                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex lg:justify-center items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-md animate-pulse dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800"></div>
                  </div>
                  <div className="h-8 w-px bg-gradient-to-b from-red-400 to-transparent dark:bg-gradient-to-b dark:from-red-500 dark:to-transparent"></div>
                  <div className="flex items-center gap-1">
                    {['Dashboard', 'Users', 'Analytics', 'System'].map((item) => (
                      <NavLink
                        key={item}
                        to={item === 'Dashboard' ? '/admin' : `/admin/${item.toLowerCase()}`}
                        className={({ isActive }) => `
                          px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md shadow-red-500/30 dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800' 
                            : 'text-gray-700 hover:bg-red-50/50 hover:text-red-600 hover:scale-105 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400'
                          }
                        `}
                      >
                        {item}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="relative group"
                  aria-label="Toggle theme"
                >
                  <div className="w-14 h-7 rounded-full transition-all duration-300 cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg shadow-red-500/30 dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800">
                    <div className={`
                      absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-500
                      ${isDark ? 'left-8 rotate-180' : 'left-1 rotate-0'}
                    `}>
                      {isDark ? 
                        <Moon className="w-3 h-3 text-gray-700 absolute top-1 left-1" /> : 
                        <Sun className="w-3 h-3 text-amber-500 absolute top-1 left-1" />
                      }
                    </div>
                  </div>
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-105 group cursor-pointer dark:hover:bg-red-900/30"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-md group-hover:blur-lg transition-all dark:bg-gradient-to-r dark:from-red-600 dark:to-red-800"></div>
                      <div className="relative w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-md dark:bg-gradient-to-br dark:from-red-600 dark:to-red-800">
                        <User className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setIsProfileMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border-red-200/50 rounded-2xl shadow-2xl border z-20 overflow-hidden dark:bg-black/95 dark:backdrop-blur-xl dark:border-red-500/30">
                        <div className="p-4 border-b border-red-200/50 bg-gradient-to-r from-red-50/50 to-transparent dark:border-red-500/30 dark:bg-gradient-to-r dark:from-red-950/30 dark:to-transparent">
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <button className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors flex items-center gap-3 group dark:hover:bg-red-950/50 dark:text-gray-300 dark:hover:text-red-400">
                            <User className="w-4 h-4 text-gray-500 group-hover:text-red-600 dark:text-gray-500 dark:group-hover:text-red-400" />
                            <span>Profile Settings</span>
                          </button>
                          <button className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors flex items-center gap-3 group dark:hover:bg-red-950/50 dark:text-gray-300 dark:hover:text-red-400">
                            <Settings className="w-4 h-4 text-gray-500 group-hover:text-red-600 dark:text-gray-500 dark:group-hover:text-red-400" />
                            <span>System Settings</span>
                          </button>
                          <hr className="my-1 border-red-200/50 dark:border-red-500/30" />
                          <button 
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 group dark:hover:bg-red-950/50"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  className="p-2 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-110 relative dark:hover:bg-red-900/30"
                >
                  <Grid3x3 className="w-8 h-8 text-red-600 cursor-pointer dark:text-red-400" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-white/90 dark:bg-black/90 text-black dark:text-white">
            <div className="p-5 md:p-7 lg:p-8">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </div>
          </main>
        </div>

        {/* Right Panel - Quick Actions */}
        <div className={`
          fixed right-0 top-21 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-red-200/50
          shadow-2xl shadow-red-500/10
          transition-all duration-500 ease-out z-40
          dark:bg-black/95 dark:backdrop-blur-xl dark:border-l dark:border-red-500/30
          ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-5 border-b border-red-200/50 bg-gradient-to-r from-red-50/30 to-transparent dark:border-red-500/30 dark:bg-gradient-to-r dark:from-red-950/30 dark:to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600 dark:text-red-500" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">Admin Tools</h3>
                </div>
                <button
                  onClick={() => setIsRightPanelOpen(false)}
                  className="p-1 rounded-lg hover:bg-red-100 cursor-pointer dark:hover:bg-red-900/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={action.action}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-50 to-white hover:shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer border border-red-200/50 dark:bg-gradient-to-r dark:from-red-950/50 dark:to-black dark:border-red-500/20 dark:hover:shadow-red-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-100 group-hover:scale-110 transition-transform dark:bg-red-900/30">
                      <action.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800 dark:text-white">{action.name}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-transparent group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-track:dark { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:dark { background: #ef4444; }
        ::-webkit-scrollbar-thumb:hover { background: #b91c1c; }
        ::-webkit-scrollbar-thumb:hover:dark { background: #f87171; }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        /* Neon Glow Effects */
        .glow-text {
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3);
        }
        
        .glow-border {
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.2);
        }
        
        .dark .glow-border {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;