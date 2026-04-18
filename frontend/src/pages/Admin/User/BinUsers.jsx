import React, { useState, useEffect } from 'react';
import { 
  Search, Users, Calendar, 
  Clock, ChevronRight, Mail, Phone,
  UserX, Archive, Copy, Check, Shield,
  AlertCircle, UserCheck, UserCog, Calendar as CalendarIcon,
  Clock as ClockIcon, RefreshCw,
  Trash
} from 'lucide-react';
import { getDeletedUsers } from '../../../utils/apiRequest';
import RestoreUser from '../../../components/Admin/RestoreUser';
import PermanentDeleteUser from '../../../components/Admin/PermanentDeleteUsers';

const BinUsers = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPermanentModal, setShowPermanentModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      const response = await getDeletedUsers();
      let usersData = [];
      if (response && response.deletedUsers) {
        usersData = response.deletedUsers;
      } else if (response && Array.isArray(response)) {
        usersData = response;
      }
      setDeletedUsers(usersData);
      setFilteredUsers(usersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching deleted users:', err);
      setError(err.message || 'Failed to fetch deleted users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  useEffect(() => {
    let filtered = deletedUsers;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, deletedUsers]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

  const handleRestore = (user) => {
    setSelectedUser(user);
    setShowRestoreModal(true);
  };

  const handlePermanentDelete = (user) => {
    setSelectedUser(user);
    setShowPermanentModal(true);
  };

  const handleCloseRestore = () => {
    setShowRestoreModal(false);
    setSelectedUser(null);
    fetchDeletedUsers();
  };

  const handleClosePermanent = () => {
    setShowPermanentModal(false);
    setSelectedUser(null);
    fetchDeletedUsers();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading deleted users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchDeletedUsers}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-white dark:from-red-950 dark:via-black dark:to-black pt-12 pb-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-400 rounded-full blur-[100px] dark:bg-red-600"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300 rounded-full blur-[120px] dark:bg-red-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 rounded-full mb-6">
              <Archive className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">Trash Bin Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4">
              DELETED USERS
              <span className="text-red-600 dark:text-red-500">.</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Manage and restore users from the trash bin
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                <Archive className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{deletedUsers.length}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">Total Deleted Users</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {deletedUsers.filter(u => u.role === 'customer').length}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">Deleted Customers</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {deletedUsers.filter(u => u.role === 'seller').length}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">Deleted Sellers</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    roleFilter === 'all' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setRoleFilter('customer')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    roleFilter === 'customer' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setRoleFilter('seller')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    roleFilter === 'seller' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  Sellers
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3 mb-8">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white dark:bg-zinc-900/30 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* User Row */}
                <div className="p-4 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/10 transition cursor-pointer">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold shadow-md">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded-lg ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                      <button
                        onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                      >
                        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedUserId === user.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details - Complete User Info */}
                {expandedUserId === user.id && (
                  <div className="border-t border-gray-100 dark:border-zinc-800 p-5 bg-gray-50/50 dark:bg-black/20">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - User Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-zinc-700 pb-2">
                          <UserCheck className="w-4 h-4 text-red-600" />
                          User Information
                        </h4>
                        
                        {/* User ID */}
                        <div className="flex items-center justify-between p-2 bg-white dark:bg-black/40 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
                            <code className="text-xs font-mono text-gray-800 dark:text-gray-300">{user.originalUserId || user.id}</code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(user.originalUserId || user.id, 'userId')}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
                          >
                            {copiedField === 'userId' ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-red-500" />
                            )}
                          </button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="text-sm text-gray-800 dark:text-white">{user.email}</span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                          <span className="text-sm text-gray-800 dark:text-white">{user.phone || 'Not provided'}</span>
                        </div>

                        {/* Role & Status */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 bg-white dark:bg-black/40 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Role</p>
                            <span className={`px-2 py-1 text-xs rounded-lg ${getRoleBadgeClass(user.role)}`}>
                              {user.role || 'customer'}
                            </span>
                          </div>
                          <div className="p-2 bg-white dark:bg-black/40 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Status</p>
                            <span className={`px-2 py-1 text-xs rounded-lg ${getStatusBadgeClass(user.status)}`}>
                              {user.status || 'active'}
                            </span>
                          </div>
                        </div>

                        {/* Verified & Blocked */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 bg-white dark:bg-black/40 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Verified</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${user.verified ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                              {user.verified ? '✓ Verified' : '✗ Not Verified'}
                            </span>
                          </div>
                          <div className="p-2 bg-white dark:bg-black/40 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Blocked</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${user.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'}`}>
                              {user.isBlocked ? '🔴 Blocked' : '🟢 Active'}
                            </span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-lg">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                            <span className="text-sm text-gray-800 dark:text-white">{formatDate(user.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-lg">
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated:</span>
                            <span className="text-sm text-gray-800 dark:text-white">{formatDate(user.updatedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Deletion Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-zinc-700 pb-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          Deletion Information
                        </h4>

                        {/* Deleted By ID */}
                        <div className="flex items-center justify-between p-2 bg-white dark:bg-black/40 rounded-lg">
                          <div className="flex items-center gap-2">
                            <UserX className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Deleted By ID:</span>
                            <code className="text-xs font-mono text-gray-800 dark:text-gray-300">{user.deletedBy?._id || user.deletedBy}</code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(user.deletedBy?._id || user.deletedBy, 'deletedById')}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
                          >
                            {copiedField === 'deletedById' ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-red-500" />
                            )}
                          </button>
                        </div>

                        {/* Deleted By Name & Email */}
                        <div className="p-2 bg-white dark:bg-black/40 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCog className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Deleted By:</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">{user.deletedBy?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="text-sm text-gray-800 dark:text-white">{user.deletedBy?.email || user.deletedByEmail || 'Unknown'}</span>
                          </div>
                        </div>

                        {/* Deleted At */}
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-lg">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Deleted At:</span>
                          <span className="text-sm text-gray-800 dark:text-white">{formatDate(user.deletedAt)}</span>
                        </div>

                        {/* Deletion Reason */}
                        {user.deletionReason && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/30">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Deletion Reason:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{user.deletionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
                      <button
                        onClick={() => handleRestore(user)}
                        className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(user)}
                        className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash className="w-4 h-4" />
                        Permanently Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-zinc-900/30 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <div className="flex flex-col items-center gap-2">
                <Archive className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No deleted users found</p>
                <p className="text-sm text-gray-400">Deleted users will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <RestoreUser 
              userId={selectedUser.id} 
              onClose={handleCloseRestore}
            />
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {showPermanentModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <PermanentDeleteUser 
              userId={selectedUser.id} 
              onClose={handleClosePermanent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BinUsers;