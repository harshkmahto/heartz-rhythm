import React, { useState } from 'react';
import { User, Settings, Package, Heart, LogOut, ChevronRight, Edit3, Guitar, Music, Calendar, ShoppingCart, X, Check, ShoppingBag, Crown, CrownIcon, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotLoggedin from '../../components/ShowCaseSection/NotLoggedin';
import Loader from '../../components/ShowCaseSection/Loader';
import Button from '../../components/ShowCaseSection/Buttons';
import EditProfile from '../../components/Auth/UpdateProfile'; // Import your EditProfile component
import UpdateProfilePicture from '../../components/Auth/UpateProfilePicture';
import ResetPassword from '../../components/Auth/ResetPassword';



const Profile = () => {
  const { user, isAuthenticated, loading, logout, logoutFromAllDevices } = useAuth();
  const navigate = useNavigate();
 
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [profilePopup, setProfilePopup] = useState(false);
  const [resetPopup, setResetPopup] = useState(false);

  const logoutHandle = async () => {
    await logout();
    navigate('/');
  }

  const logoutAllHandle = async () => {
    await logoutFromAllDevices();
    navigate('/');
  }

  const handleUpdateProfile = () => {
    setShowEditPopup(true);
  };

   const handleClosePopup = () => {
    setShowEditPopup(false);
  };


  const handleProfilePicture = () => {
    setProfilePopup(true);
  };

  const handleCloseProfilePopup = () => {
    setProfilePopup(false);

  }

  const handleResetPassword = () => {
    setResetPopup(true);
  };

  const handleCloseResetPopup = () => {
    setResetPopup(false);
  };

 
  if (loading) {
    return <Loader fullScreen text="Loading your profile..." />;
  }

  if (!isAuthenticated) {
    return <NotLoggedin />;
  }

  // Stats data (coming from backend later)
  const stats = [
    { icon: Package, label: 'Total Orders', value: 0, color: 'red', bg: 'red' },
    { icon: Heart, label: 'Wishlist', value: 0, color: 'purple', bg: 'purple' },
    { icon: ShoppingCart, label: 'Cart Items', value: 0, color: 'blue', bg: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-black dark:from-black dark:via-black dark:to-black">
      {/* Edit Profile Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-white/10 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
           
            <EditProfile 
              user={user}    
              onClose={handleClosePopup}
            />
          </div>
        </div>
      )}

       {profilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
           
            <UpdateProfilePicture 
              user={user}    
              onClose={handleCloseProfilePopup}
            />
          </div>
        </div>
      )}

      {resetPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
           
            <ResetPassword
              user={user}    
              onClose={handleCloseResetPopup}
            />
          </div>
        </div>
      )}



      <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-px bg-gradient-to-r from-red-500 to-transparent hidden lg:block" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-px bg-gradient-to-l from-red-500 to-transparent hidden lg:block" />
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Your
            </span>
            <span className="text-red-600 mx-3">Backstage</span>
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your profile, track your gear, and keep the rhythm alive.
          </p>
          
          <div className="absolute -top-4 left-1/4 text-red-500 text-2xl animate-float hidden lg:block">♪</div>
          <div className="absolute -bottom-4 right-1/4 text-red-500 text-xl animate-float delay-100 hidden lg:block">♫</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Profile Card */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Profile Card - Enhanced */}
            <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-red-900 p-6 text-center relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all" />
              
              {/* Profile Image - Increased Size */}
              <div className="relative w-36 h-36 mx-auto mb-5">
                <div className="w-full h-full rounded-full border-4 border-red-500/30 overflow-hidden group-hover:border-red-500 transition-all duration-300">
                  <img 
                    className="w-full h-full object-cover" 
                    src={user?.profilePicture?.url || "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=150&h=150&fit=crop"} 
                    alt="Profile" 
                  />
                </div>
                <button 
                  onClick={handleProfilePicture}
                  className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              
              {/* Name */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user?.name || "Guitarist"}</h3>
              
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase">
                  Status: {user?.status || "Active"}
                </span>
              </div>
              
              {/* Role Badges */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-full">
                  <Music size={14} className="text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {user?.role === 'seller' ? 'Seller' : 'Guitarist'}
                  </span>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                    <Crown size={14} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Admin
                    </span>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-red-900/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Navigation Menu - Same as before */}
            <nav className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-red-900 p-4">
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold transition-all">
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span>Account Info</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                {user?.role === 'seller' && (
                  <button 
                    onClick={() => navigate('/seller')}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <CrownIcon size={18} />
                      <span>Seller Dashboard</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                )}

                {user?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <Crown size={18} />
                      <span>Admin Panel</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                )}
                
                <button 
                  onClick={() => navigate('/my-orders')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Package size={18} />
                    <span>Order History</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                
                <button 
                  onClick={() => navigate('/cart')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <ShoppingCart size={18} />
                    <span>My Cart</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                
                <button 
                  onClick={() => navigate('/shop')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <ShoppingBag size={18} />
                    <span>Shop</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                
                <div className="border-t border-gray-200 dark:border-red-900/30 my-3" />
                
                <button 
                  onClick={logoutHandle}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button 
                  onClick={logoutAllHandle}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold cursor-pointer"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <LogOut size={18} />
                    <span>Logout All Devices</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Personal Details Card - Simple Display Card */}
            <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-red-900/30 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-red-900/30 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <User size={24} className="text-red-600" />
                  Personal Details
                </h2>
                <Button 
                  text="Update Profile" 
                  onClick={handleUpdateProfile}
                  fromColor="red-600"
                  toColor="red-700"
                  shadowColor="red-500"
                  size="sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <User size={14} />
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white py-3 px-4 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-red-600">
                    {user?.name || 'Not provided'}
                  </p>
                </div>
                
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white py-3 px-4 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-red-600">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <Phone size={14} />
                    Phone Number
                  </label>
                  <p className="text-gray-900 dark:text-white py-3 px-4 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-red-600">
                    {user?.phone || 'Not provided'}
                  </p>
                </div>

                {/* Account Since */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <CalendarIcon size={14} />
                    Account Since
                  </label>
                  <p className="text-gray-900 dark:text-white py-3 px-4 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-red-600">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>

              </div>
              <div className='flex justify-end items-end mt-4 '>
              <Button text="Reset Password" size='sm'
              onClick={handleResetPassword} />
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-red-900/30 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-red-900/30 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Package size={24} className="text-red-600" />
                  Recent Orders
                </h2>
                <button 
                  onClick={() => navigate('/my-orders')}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-red-900/20 mb-4">
                  <Package size={32} className="text-gray-400 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Your order history will appear here once you make your first purchase.
                </p>
                <Button 
                  text="Start Shopping" 
                  onClick={() => navigate('/shop')}
                  fromColor="red-600"
                  toColor="red-700"
                  shadowColor="red-500"
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white dark:bg-black rounded-2xl p-5 text-center border border-gray-200 dark:border-red-900/30 hover:border-red-500/50 transition-all group"
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-${stat.bg}-50 dark:bg-${stat.bg}-900/20 mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} className={`text-${stat.color}-600 dark:text-${stat.color}-500`} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Coming Soon Section */}
            <div className="bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-3">
                <Guitar size={24} className="text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">More Features Coming Soon</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We're working on exciting new features like order tracking, reviews, and exclusive member benefits. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;