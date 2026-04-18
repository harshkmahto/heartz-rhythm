import React, { useState, useEffect } from 'react';
import { getSingleUser, deleteUser } from '../../utils/apiRequest';
import { X, Copy, Check, Mail, Phone, AlertTriangle, UserX, Trash2 } from 'lucide-react';

const DeleteUsers = ({ userId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Please provide a reason for deletion');
      return;
    }

    setDeleting(true);
    setError('');
    
    try {
      await deleteUser(userId, deleteReason );
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
      setDeleting(false);
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
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
    <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      {/* Fixed Header - Red Gradient */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-900 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center cursor-pointer">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Delete User</h2>
            <p className="text-red-100 text-sm">Move user to trash bin</p>
          </div>
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
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-400">Move to Trash</p>
              <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                This user will be moved to the trash bin. You can restore them within 30 days from the deleted users section.
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-4 p-5 bg-rose-50 dark:bg-black rounded-xl border border-rose-200 dark:border-red-900/30">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
            {user?.profilePicture?.url ? (
              <img 
                src={user.profilePicture.url} 
                alt={user?.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(user?.name)
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{user?.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.phone}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <code className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                ID: {userId?.slice(0, 8)}...{userId?.slice(-4)}
              </code>
              <button
                onClick={() => copyToClipboard(userId, 'id')}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Copy ID"
              >
                {copiedField === 'id' ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-red-500 hover:text-red-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
            <p className="font-medium text-gray-800 dark:text-white capitalize">{user?.role}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <p className={`font-medium capitalize ${
              user?.status === 'active' ? 'text-green-600' : 
              user?.status === 'pending' ? 'text-yellow-600' : 'text-orange-600'
            }`}>{user?.status}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Verified</p>
            <p className={`font-medium ${user?.verified ? 'text-green-600' : 'text-red-600'}`}>
              {user?.verified ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Blocked</p>
            <p className={`font-medium ${user?.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
              {user?.isBlocked ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Delete Reason */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Reason for Deletion
          </label>
          <textarea
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Please provide a reason for deleting this user..."
            rows="3"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            This reason will be stored in audit logs for future reference
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-600 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Fixed Footer - Action Buttons */}
      <div className="border-t border-rose-200 dark:border-red-900/30 p-4 bg-white dark:bg-black sticky bottom-0 z-10">
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || !deleteReason.trim()}
            className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 " />
                Move to Trash
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUsers;