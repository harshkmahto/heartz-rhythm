import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Trash2, Check, AlertCircle, User, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { updateProfilePicture, deleteProfilePicture } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';

const UpdateProfilePicture = ({ user, onClose, onUpdate }) => {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture?.url || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ 
          type: 'error', 
          text: 'Only JPEG, PNG, GIF, and WEBP images are allowed' 
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ 
          type: 'error', 
          text: 'Image size must be less than 5MB' 
        });
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpdate = async () => {
    if (!selectedImage) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await updateProfilePicture(selectedImage);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        
        // Update user context
        if (updateUser) {
          updateUser(response.user);
        }
        
        // Call onUpdate callback
        if (onUpdate) {
          onUpdate(response.user);
        }
        
        // Clear selected image
        setSelectedImage(null);
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile picture' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while updating profile picture' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await deleteProfilePicture();
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile picture deleted successfully!' });
        setImagePreview(null);
        setSelectedImage(null);
        
        // Update user context
        if (updateUser) {
          updateUser(response.user);
        }
        
        // Call onUpdate callback
        if (onUpdate) {
          onUpdate(response.user);
        }
        
        // Close confirm dialog
        setShowDeleteConfirm(false);
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to delete profile picture' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while deleting profile picture' 
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (selectedImage) {
      // Reset to original image
      setImagePreview(user?.profilePicture?.url || null);
      setSelectedImage(null);
      setMessage({ type: '', text: '' });
    } else {
      onClose();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black rounded-3xl shadow-2xl border border-gray-200 dark:border-red-900/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Camera className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Profile Picture</h2>
              <p className="text-red-100 text-sm">Update your profile image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {/* Image Preview Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-red-500/30 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <User size={48} className="text-gray-400 dark:text-gray-600" />
                  <span className="text-xs text-gray-400 mt-2">No image</span>
                </div>
              )}
            </div>
            
            {/* Upload overlay on hover */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <div className="text-center">
                <Camera size={32} className="text-white mx-auto mb-2" />
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageSelect} 
                className="hidden"
              />
            </label>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Click on image to change • Max 5MB • JPG, PNG, GIF, WEBP
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Update Section */}
          {selectedImage && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    New image selected
                  </span>
                </div>
                <button
                  onClick={() => {
                    setImagePreview(user?.profilePicture?.url || null);
                    setSelectedImage(null);
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
              </p>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Update Profile Picture</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Delete Section */}
          {user?.profilePicture?.url && !selectedImage && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Delete current picture
                </span>
              </div>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>Delete Picture</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {deleting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Yes, Delete</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {selectedImage ? 'Cancel Changes' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePicture;