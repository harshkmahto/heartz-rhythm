import React, { useState } from 'react';
import { User, Mail, Phone, X, Check, Guitar, Save, AlertCircle } from 'lucide-react';
import { updateUserProfile } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';

const UpdateProfile = ({ user, onClose, onUpdate }) => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Only send name and phone (no file)
      const submitData = {
        name: formData.name,
        phone: formData.phone
      };

      console.log('Sending data:', submitData);

      const response = await updateUserProfile(submitData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        if (updateUser) {
          updateUser(response.user);
        }
        
        if (onUpdate) {
          onUpdate(response.user);
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while updating profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Guitar-themed decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
      
      {/* Music notes decoration */}
      <div className="absolute top-10 left-10 text-red-500/30 text-2xl animate-pulse">♪</div>
      <div className="absolute bottom-10 right-10 text-red-500/30 text-xl animate-pulse delay-100">♫</div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Guitar className="text-white" size={24} />
            <h2 className="text-xl font-bold text-white">Update Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-red-300 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-red-100 text-sm mt-1">Keep your rhythm alive with updated info</p>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User size={14} className="inline mr-1 text-red-600" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-300 dark:border-red-900/50 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Mail size={14} className="inline mr-1 text-red-600" />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-red-900/30 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Phone size={14} className="inline mr-1 text-red-600" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-300 dark:border-red-900/50 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`p-3 rounded-xl flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' :
            message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' :
            'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
          }`}>
            {message.type === 'success' ? <Check size={16} /> : 
             message.type === 'error' ? <AlertCircle size={16} /> : null}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;