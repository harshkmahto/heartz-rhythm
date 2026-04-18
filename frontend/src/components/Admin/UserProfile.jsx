import React, { useState, useEffect } from 'react';
import { getSingleUser } from '../../utils/apiRequest';
import { X } from 'lucide-react';

const UserProfile = ({ userId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSingleUser(userId);
      if (response.success || response.user) {
        const userData = response.user || response;
        setUser(userData);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-12 h-12 border-4 border-rose-200 dark:border-red-900/30 border-t-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile picture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchUserDetails}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with Close Button */}
      <div className="flex justify-end p-4 border-b border-gray-100 dark:border-zinc-800">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5 text-red-500 dark:text-red-400" />
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center justify-center p-8 pt-4">
        <div className="relative">
          {/* Main Profile Picture */}
          <div className="w-full h-92  rounded-2xl overflow-hidden bg-gradient-to-br from-red-500 to-red-700 shadow-2xl ring-4 ring-red-100 dark:ring-red-600/30">
            {user?.profilePicture?.url ? (
              <img 
                src={user.profilePicture.url} 
                alt={user?.name || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-80 h-80 flex items-center justify-center">
                <span className="text-7xl font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              </div>
            )}
          </div>

          {/* Optional: User Name Badge */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap ">
            {user?.name || 'User'}
          </div>
        </div>

        {/* Optional: Quick Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click outside or press ✕ to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;