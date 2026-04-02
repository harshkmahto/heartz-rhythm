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
  Flame
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

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
    navigate('/login');
  };

  // Main navigation items for admin sidebar
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true, section: 'dashboard' },
    { name: 'Users', path: '/admin/users', icon: Users, section: 'users',
      subItems: [
        { name: 'All Users', path: '/admin/users/all', icon: Users },
        { name: 'Sellers', path: '/admin/users/sellers', icon: Crown },
        { name: 'Buyers', path: '/admin/users/buyers', icon: User },
        { name: 'Verification', path: '/admin/users/verification', icon: Shield }
      ]
    },
    { name: 'Products', path: '/admin/products', icon: Package, section: 'products',
      subItems: [
        { name: 'All Products', path: '/admin/products/all', icon: Grid3x3 },
        { name: 'Categories', path: '/admin/products/categories', icon: Tag },
        { name: 'Reported Items', path: '/admin/products/reported', icon: AlertCircle },
        { name: 'Inventory', path: '/admin/products/inventory', icon: Package }
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gradient-to-br from-red-50 via-white to-orange-50'}`}>
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
            ${isDark 
              ? 'bg-black/95 backdrop-blur-xl border-r border-red-500/30 shadow-2xl shadow-red-500/20' 
              : 'bg-white/95 backdrop-blur-xl border-r border-red-200/50 shadow-2xl shadow-red-500/10'
            }
            overflow-hidden
          `}
        >
          {/* Sidebar Header */}
          <div className="relative overflow-hidden">
            <div className={`flex items-center justify-between h-20 px-5 border-b ${isDark ? 'border-red-500/30 bg-gradient-to-r from-red-950/50 via-black to-red-950/30' : 'border-red-200/50 bg-gradient-to-r from-red-50/80 via-white to-red-50/30'}`}>
              {(!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen) ? (
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-red-500 to-red-700'} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                    <div className={`relative w-10 h-10 ${isDark ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-red-500 to-red-700'} rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30`}>
                      <Flame className="w-5 h-5 text-white animate-pulse" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div>
                    <span className={`font-bold text-xl ${isDark ? 'bg-gradient-to-r from-red-500 to-red-300' : 'bg-gradient-to-r from-red-600 to-red-500'} bg-clip-text text-transparent`}>
                      HEARTZ RHYTHM
                    </span>
                    <p className={`text-xs ${isDark ? 'text-red-400/70' : 'text-red-600/70'}`}>Admin Console</p>
                  </div>
                </div>
              ) : (!isMobile && !isSidebarOpen) && (
                <div className="relative w-10 h-10 mx-auto">
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-red-500 to-red-700'} rounded-2xl blur-lg animate-pulse`}></div>
                  <div className={`relative w-full h-full ${isDark ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-red-500 to-red-700'} rounded-2xl flex items-center justify-center`}>
                    <Flame className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>
              )}
              
              {!isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`hidden lg:flex p-2 rounded-xl ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} transition-all duration-300 hover:scale-110 hover:rotate-180`}
                >
                  {isSidebarOpen ? 
                    <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} /> : 
                    <ChevronRight className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  }
                </button>
              )}
              
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-xl ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              )}
            </div>
            
            {/* Red Glow Animation Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse`}></div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto py-6 px-3 space-y-2 ${isDark ? 'bg-black/50' : 'bg-white/50'}`}>
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
                      ? `${isDark ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/30' : 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30'} scale-[1.02]` 
                      : `${isDark ? 'text-gray-400 hover:bg-red-950/50 hover:text-red-400' : 'text-gray-700 hover:bg-red-50/80 hover:text-red-600'} hover:scale-[1.02] hover:shadow-md`
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${(!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen) ? '' : 'mx-auto'} group-hover:scale-110`} />
                  {((!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen)) && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.name}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs ${isDark ? 'bg-red-500 text-white' : 'bg-red-500 text-white'} rounded-full shadow-sm animate-pulse`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
                
                {/* SubItems */}
                {((!isMobile && isSidebarOpen) || (isMobile && isMobileMenuOpen)) && item.subItems && (
                  <div className={`ml-12 mt-2 space-y-1 border-l-2 ${isDark ? 'border-red-500/30' : 'border-red-200/50'} pl-3`}>
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => isMobile && handleMobileMenuClose()}
                        className={({ isActive }) => `
                          flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-all duration-200
                          ${isActive 
                            ? `${isDark ? 'text-red-400 font-semibold bg-red-950/50' : 'text-red-600 font-semibold bg-red-50/80'}` 
                            : `${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-950/30' : 'text-gray-600 hover:text-red-600 hover:bg-red-50/50'}`
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
            <div className={`border-t ${isDark ? 'border-red-500/30' : 'border-red-200/50'} p-4 ${isDark ? 'bg-gradient-to-t from-red-950/20 to-transparent' : 'bg-gradient-to-t from-red-50/20 to-transparent'}`}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300 group justify-start"
              >
                <LogOut className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
          
          {/* Compact footer for desktop collapsed state */}
          {!isMobile && !isSidebarOpen && (
            <div className={`border-t ${isDark ? 'border-red-500/30' : 'border-red-200/50'} p-4 ${isDark ? 'bg-gradient-to-t from-red-950/20 to-transparent' : 'bg-gradient-to-t from-red-50/20 to-transparent'}`}>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full p-2 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300 group"
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
          <header className={`relative ${isDark ? 'bg-black/80 backdrop-blur-xl border-b border-red-500/30' : 'bg-white/80 backdrop-blur-xl border-b border-red-200/50'} shadow-sm`}>
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse`}></div>
            
            <div className="flex items-center justify-between gap-20 mx-10 px-4 md:px-6 h-16 lg:h-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`lg:hidden p-2 rounded-xl ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} transition-all duration-300 hover:scale-110`}
                >
                  <Menu className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                </button>
                <div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-red-500' : 'text-red-600'}`}>Admin Panel</p>
                </div>
                
                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex lg:justify-center items-center gap-2">
                  <div className="relative">
                    <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-red-500 to-red-700'} rounded-full blur-md animate-pulse`}></div>
                  </div>
                  <div className={`h-8 w-px ${isDark ? 'bg-gradient-to-b from-red-500 to-transparent' : 'bg-gradient-to-b from-red-400 to-transparent'}`}></div>
                  <div className="flex items-center gap-1">
                    {['Dashboard', 'Users', 'Analytics', 'System'].map((item) => (
                      <NavLink
                        key={item}
                        to={item === 'Dashboard' ? '/admin' : `/admin/${item.toLowerCase()}`}
                        className={({ isActive }) => `
                          px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300
                          ${isActive 
                            ? `${isDark ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md shadow-red-500/30' : 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md shadow-red-500/30'}` 
                            : `${isDark ? 'text-gray-400 hover:bg-red-950/50 hover:text-red-400' : 'text-gray-700 hover:bg-red-50/50 hover:text-red-600'} hover:scale-105`
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
                  <div className={`
                    w-14 h-7 rounded-full transition-all duration-300 cursor-pointer
                    ${isDark ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-gray-700 to-gray-800'}
                    shadow-lg shadow-red-500/30
                  `}>
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
                    className={`flex items-center gap-2.5 p-1.5 rounded-xl ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} transition-all duration-300 hover:scale-105 group cursor-pointer`}
                  >
                    <div className="relative">
                      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-red-500 to-red-700'} rounded-full blur-md group-hover:blur-lg transition-all`}></div>
                      <div className={`relative w-9 h-9 ${isDark ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-red-500 to-red-700'} rounded-full flex items-center justify-center shadow-md`}>
                        <User className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                      <div className={`absolute right-0 mt-2 w-64 ${isDark ? 'bg-black/95 backdrop-blur-xl border-red-500/30' : 'bg-white/95 backdrop-blur-xl border-red-200/50'} rounded-2xl shadow-2xl border z-20 overflow-hidden`}>
                        <div className={`p-4 border-b ${isDark ? 'border-red-500/30 bg-gradient-to-r from-red-950/30 to-transparent' : 'border-red-200/50 bg-gradient-to-r from-red-50/50 to-transparent'}`}>
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Admin User</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>admin@heartrhythm.com</p>
                        </div>
                        <div className="py-2">
                          <button className={`w-full px-4 py-2.5 text-sm text-left ${isDark ? 'hover:bg-red-950/50 text-gray-300 hover:text-red-400' : 'hover:bg-red-50 text-gray-700 hover:text-red-600'} transition-colors flex items-center gap-3 group`}>
                            <User className={`w-4 h-4 ${isDark ? 'text-gray-500 group-hover:text-red-400' : 'text-gray-500 group-hover:text-red-600'}`} />
                            <span>Profile Settings</span>
                          </button>
                          <button className={`w-full px-4 py-2.5 text-sm text-left ${isDark ? 'hover:bg-red-950/50 text-gray-300 hover:text-red-400' : 'hover:bg-red-50 text-gray-700 hover:text-red-600'} transition-colors flex items-center gap-3 group`}>
                            <Settings className={`w-4 h-4 ${isDark ? 'text-gray-500 group-hover:text-red-400' : 'text-gray-500 group-hover:text-red-600'}`} />
                            <span>System Settings</span>
                          </button>
                          <hr className={`my-1 ${isDark ? 'border-red-500/30' : 'border-red-200/50'}`} />
                          <button 
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors flex items-center gap-3 group"
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
                  className={`p-2 rounded-xl ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} transition-all duration-300 hover:scale-110 relative`}
                >
                  <Grid3x3 className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'} cursor-pointer`} />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-5 md:p-7 lg:p-8">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </div>
          </main>
        </div>

        {/* Right Panel - Quick Actions */}
        <div className={`
          fixed right-0 top-21 h-full w-80 ${isDark ? 'bg-black/95 backdrop-blur-xl border-l border-red-500/30' : 'bg-white/95 backdrop-blur-xl border-l border-red-200/50'}
          shadow-2xl shadow-red-500/10
          transition-all duration-500 ease-out z-40
          ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className={`p-5 border-b ${isDark ? 'border-red-500/30 bg-gradient-to-r from-red-950/30 to-transparent' : 'border-red-200/50 bg-gradient-to-r from-red-50/30 to-transparent'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className={`w-5 h-5 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Admin Tools</h3>
                </div>
                <button
                  onClick={() => setIsRightPanelOpen(false)}
                  className={`p-1 rounded-lg ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'} cursor-pointer`}
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
                  className={`w-full p-4 rounded-2xl ${isDark ? 'bg-gradient-to-r from-red-950/50 to-black' : 'bg-gradient-to-r from-red-50 to-white'} ${isDark ? 'hover:shadow-red-500/30' : 'hover:shadow-red-500/20'} hover:shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer border ${isDark ? 'border-red-500/20' : 'border-red-200/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-100'} group-hover:scale-110 transition-transform`}>
                      <action.icon className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{action.name}</p>
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-transparent group-hover:translate-x-full transition-transform duration-500`}></div>
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
        ::-webkit-scrollbar-track { background: ${isDark ? '#1a1a1a' : '#f1f1f1'}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#ef4444' : '#dc2626'}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#f87171' : '#b91c1c'}; }
        
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