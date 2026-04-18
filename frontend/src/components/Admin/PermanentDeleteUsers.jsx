import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Mail, Phone, AlertTriangle, 
  Shield, Calendar, Clock, UserX, Trash2,
  Key, AlertCircle, UserCheck
} from 'lucide-react';
import { getSingleDeletedUser, permanentDeleteUser } from '../../utils/apiRequest';

const PermanentDeleteUsers = ({ userId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSingleDeletedUser(userId);
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

  const handlePermanentDelete = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Please enter verification code');
      return;
    }
    
    if (verificationCode !== '9565') {
      setVerificationError('Invalid verification code');
      return;
    }

    setDeleting(true);
    setVerificationError('');
    setError('');
    
    try {
      await permanentDeleteUser(userId);
      setSuccess('User permanently deleted from system!');
      
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Permanent delete error:', err);
      setError(err.message || 'Failed to permanently delete user');
      setDeleting(false);
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'review':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      case 'seller':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    }
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
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Permanently Delete User</h2>
            <p className="text-red-100 text-sm">This action cannot be undone</p>
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
        {/* Danger Warning Banner */}
        <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-400">⚠️ DANGER: This action is irreversible!</p>
              <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                Permanently deleting this user will remove ALL their data from the system forever. 
                This action cannot be undone or recovered.
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-4 p-5 bg-rose-50 dark:bg-black rounded-xl border border-rose-200 dark:border-red-900/30">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
            {getInitials(user?.name)}
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
                Original ID: {user?.originalUserId?.slice(0, 8)}...{user?.originalUserId?.slice(-4)}
              </code>
              <button
                onClick={() => copyToClipboard(user?.originalUserId, 'userId')}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Copy ID"
              >
                {copiedField === 'userId' ? (
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
            <p className={`inline-flex px-2 py-1 text-xs rounded-lg mt-1 ${getRoleBadgeClass(user?.role)}`}>
              {user?.role || 'customer'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <p className={`inline-flex px-2 py-1 text-xs rounded-lg mt-1 ${getStatusBadgeClass(user?.status)}`}>
              {user?.status || 'active'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Verified</p>
            <p className={`inline-flex px-2 py-1 text-xs rounded-lg mt-1 ${user?.verified ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
              {user?.verified ? '✓ Verified' : '✗ Not Verified'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Blocked</p>
            <p className={`inline-flex px-2 py-1 text-xs rounded-lg mt-1 ${user?.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'}`}>
              {user?.isBlocked ? '🔴 Blocked' : '🟢 Active'}
            </p>
          </div>
        </div>

        {/* Deletion Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Deleted At:</span>
            <span className="text-sm text-gray-800 dark:text-white">{formatDate(user?.deletedAt)}</span>
          </div>
          {user?.deletionReason && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Deletion Reason:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{user.deletionReason}</p>
            </div>
          )}
        </div>

        {/* Verification Code Section */}
        <div className="border-t border-red-200 dark:border-red-900/30 pt-4">
          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-gray-800 dark:text-white">Verification Required</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter the 4-digit verification code to confirm permanent deletion. 
              This action <span className="font-bold text-red-600">cannot be undone</span>.
            </p>
            
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setVerificationError('');
                }}
                placeholder="Enter 4-digit verification code"
                maxLength="4"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition text-center text-2xl tracking-widest font-mono"
              />
            </div>
            
            {verificationError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {verificationError}
              </p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Contact your system administrator for the verification code.
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-600 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-600 rounded-lg">
            <Check className="w-4 h-4 text-green-600" />
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
            className="px-6 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handlePermanentDelete}
            disabled={deleting || !verificationCode.trim()}
            className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting Permanently...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Permanently Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermanentDeleteUsers;