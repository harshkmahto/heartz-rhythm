import React, { useState, useEffect } from 'react';
import { updateUserByAdmin, getSingleUser } from '../../utils/apiRequest';
import { X, Check, Copy } from 'lucide-react';

const UpdateUserRole = ({ onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'customer',
    isBlocked: false,
    verified: false,
    status: 'active',
    profilePicture: null
  });

  const roleOptions = ['customer', 'seller', 'admin'];
  const statusOptions = ['active', 'pending', 'review'];

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setFetchLoading(true);
    try {
      const response = await getSingleUser(userId);
      if (response.success || response.user) {
        const user = response.user || response;
        setUserData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'customer',
          isBlocked: user.isBlocked || false,
          verified: user.verified || false,
          status: user.status || 'active',
          profilePicture: user.profilePicture || null
        });
      }
    } catch (err) {
      setError('Failed to fetch user data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleToggle = (field) => {
    setUserData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSelectChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        role: userData.role,
        isBlocked: userData.isBlocked,
        verified: userData.verified,
        status: userData.status
      };

      const response = await updateUserByAdmin(userId, updateData);
      setSuccess('User updated successfully!');
      
      setTimeout(() => {
        fetchUserData();
        setTimeout(() => {
          onClose?.();
        }, 1500);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getInitials = (name) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  const ToggleSwitch = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-black rounded-xl border border-rose-200 dark:border-red-900/30 transition-all duration-300 hover:shadow-md">
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          checked ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
            checked ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  if (fetchLoading) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-12 h-12 border-4 border-rose-200 dark:border-red-900/30 border-t-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      {/* Fixed Header - Red Gradient */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-900 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-white">Update User Role</h2>
          <p className="text-red-100 text-sm">Manage user permissions and account status</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* User Profile Card */}
        <div className="flex items-center gap-4 p-5 bg-rose-50 dark:bg-black rounded-xl border border-rose-200 dark:border-red-900/30">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
            {userData.profilePicture?.url ? (
              <img 
                src={userData.profilePicture.url} 
                alt={userData.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(userData.name)
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{userData.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                ID: {userId?.slice(0, 8)}...{userId?.slice(-4)}
              </code>
              <button
                onClick={() => copyToClipboard(userId)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Copy ID"
              >
                {copiedId ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-red-500 hover:text-red-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-3">
            <span>👤</span> User Role
          </label>
          <div className="flex gap-3 flex-wrap">
            {roleOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectChange('role', option)}
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                  userData.role === option
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Determines user permissions and access level</p>
        </div>

        {/* Status Selection */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-3">
            <span>📊</span> Account Status
          </label>
          <div className="flex gap-3 flex-wrap">
            {statusOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectChange('status', option)}
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                  userData.status === option
                    ? option === 'active'
                      ? 'bg-green-600 text-white shadow-md scale-105'
                      : option === 'pending'
                      ? 'bg-yellow-600 text-white shadow-md scale-105'
                      : 'bg-orange-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Controls account accessibility and verification status</p>
        </div>

        {/* Toggle Switches */}
        <div className="space-y-3 pt-2">
          <ToggleSwitch
            label="Block User"
            description="Prevents user from accessing the platform"
            checked={userData.isBlocked}
            onChange={() => handleToggle('isBlocked')}
          />
          
          <ToggleSwitch
            label="Verified User"
            description="Confirms user identity and email"
            checked={userData.verified}
            onChange={() => handleToggle('verified')}
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-600 rounded-lg">
            <span>⚠️</span>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-600 rounded-lg">
            <span>✓</span>
            <p className="text-green-700 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}
      </div>

      {/* Fixed Footer - Action Buttons */}
      <div className="border-t border-rose-200 dark:border-red-900/30 p-4 bg-white dark:bg-black sticky bottom-0 z-10">
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRole;