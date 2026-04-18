import React, { useState } from 'react';
import { Lock, Key, Check, AlertCircle, Eye, EyeOff, Shield, Guitar, X } from 'lucide-react';
import { resetPassword } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return false;
    }
    
    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return false;
    }
    
    if (!formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please confirm your new password' });
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await resetPassword({
        email: user?.email,
        password: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password reset successfully! Please login again.' });
        
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Close modal after delay
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while resetting password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/10 backdrop rounded-3xl shadow-2xl border border-gray-200 dark:border-red-900/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      {/* Music notes decoration */}
      <div className="absolute top-10 left-10 text-red-500/20 text-2xl animate-pulse hidden md:block">♪</div>
      <div className="absolute bottom-10 right-10 text-red-500/20 text-xl animate-pulse delay-100 hidden md:block">♫</div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <p className="text-red-100 text-sm">Change your account password</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {/* User Info Card */}
        <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-black rounded-2xl border border-gray-200 dark:border-red-900/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                <img src={user?.profilePicture?.url } alt="" 
                className='w-full h-full rounded-2xl'/>
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {user?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || 'No email provided'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Active Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2">
              <Lock size={14} className="inline mr-2 text-red-600" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-300 dark:border-red-900/50 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter your current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold black dark:text-white mb-2">
              <Key size={14} className="inline mr-2 text-red-600" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-300 dark:border-red-900/50 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter new password (min 6 characters)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2">
              <Check size={14} className="inline mr-2 text-red-600" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-300 dark:border-red-900/50 rounded-xl text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                placeholder="Re-enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      formData.newPassword.length >= 6 
                        ? formData.newPassword.length >= 8 
                          ? 'w-full bg-green-500' 
                          : 'w-2/3 bg-yellow-500'
                        : 'w-1/3 bg-red-500'
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {formData.newPassword.length >= 8 
                    ? 'Strong' 
                    : formData.newPassword.length >= 6 
                      ? 'Medium' 
                      : 'Weak'}
                </span>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {message.type === 'success' ? (
                <Check size={18} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

         

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>Reset Password</span>
              </>
            )}
          </button>

          {/* Security Tip */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <Guitar size={12} />
              <span>Keep your password secure and don't share it with anyone</span>
              <Guitar size={12} />
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;