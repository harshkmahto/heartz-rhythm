import React, { useEffect, useState } from 'react'
import { X, Mail, Phone, User, Calendar, Shield, CheckCircle, XCircle, Copy, Check, Clock, Crown, Blocks, Activity } from 'lucide-react'
import { getSingleUser } from '../../utils/apiRequest'
import { Link } from 'react-router-dom'

const UserAllDetails = ({ onClose, userId }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copiedField, setCopiedField] = useState(null)

    useEffect(() => {
        if (userId) {
            fetchUserDetails()
        }
    }, [userId])

    const fetchUserDetails = async () => {
        try {
            setLoading(true)
            const response = await getSingleUser(userId)
            console.log('User details response:', response)
            
            let userData = null
            if (response && response.user) {
                userData = response.user
            } else if (response && response.data && response.data.user) {
                userData = response.data.user
            } else if (response && response.data) {
                userData = response.data
            }
            
            setUser(userData)
            setError(null)
        } catch (err) {
            console.error('Error fetching user details:', err)
            setError(err.response?.data?.message || 'Failed to fetch user details')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 'active':
                return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" /> }
            case 'inactive':
                return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: <XCircle className="w-4 h-4" /> }
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="w-4 h-4" /> }
            default:
                return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: null }
        }
    }

    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'seller':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            case 'customer':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const getInitials = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'U'
    }

    // Loading State
    if (loading) {
        return (
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-red-200 dark:border-red-800/50">
                <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-600 to-orange-600">
                    <h2 className="text-xl font-bold text-white">User Details</h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading user details...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Error State
    if (error) {
        return (
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-red-200 dark:border-red-800/50">
                <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-600 to-orange-600">
                    <h2 className="text-xl font-bold text-white">User Details</h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button 
                        onClick={fetchUserDetails}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!user) return null

    const statusInfo = getStatusBadge(user.status)

    return (
        <div className="bg-white/60 dark:bg-black/30  backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-red-200 dark:border-red-800/50">
            {/* Header - Redish Gradient */}
            <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-600 to-orange-600">
                <h2 className="text-xl font-bold text-white">User Details</h2>
                <button onClick={onClose} className="cursor-pointer text-white hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content with Glass Effect */}
            <div className="p-6">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-red-200 dark:border-red-800/50">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-4 ring-red-300 dark:ring-red-700">
                        {user.profilePicture?.url ? (
                            <img 
                                src={user.profilePicture.url} 
                                alt={user.name} 
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            getInitials(user.name)
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name || 'N/A'}</h3>
                            <button
                                onClick={() => copyToClipboard(user.name, 'name')}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                                {copiedField === 'name' ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getRoleBadge(user.role)}`}>
                                {user.role || 'customer'}
                            </span>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {user.status || 'active'}
                            </span>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${user.verified ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {user.verified ? '✓ Verified' : '✗ Not Verified'}
                            </span>
                        </div>
                    </div>
                    {user.role === 'seller' && (
                        <div>
                            <Link to={`/admin/seller-profile/${user.id}`}
                             className="bg-red-500 hover:bg-red-600 text-white active:scale-95 p-2.5  rounded-2xl cursor-pointer">View Profile</Link>
                        </div>
                    )}
                </div>

                {/* User Info Grid - Glass Effect Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User ID */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium">User ID</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(user.id, 'id')}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                                {copiedField === 'id' ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                    <Copy className="w-3 h-3 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <code className="text-sm text-gray-700 dark:text-gray-300 break-all">{user.id}</code>
                    </div>

                    {/* Email */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium">Email</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(user.email, 'email')}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                                {copiedField === 'email' ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                    <Copy className="w-3 h-3 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{user.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Phone</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{user.phone || 'Not provided'}</p>
                    </div>

                    {/* Role */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                            <Crown className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Role</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{user.role || 'customer'}</p>
                    </div>
                    
                    {/* Verify */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                            <Shield className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Verify</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{user.verified ? '✓ Verified' : '✗ Not Verified'}</p>
                    </div>

                     {/* Blocked */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                            <Activity className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Blocked</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{user.isBlocked ? '✓ Blocked' : '✗ Not Blocked'}</p>
                    </div>

                    {/* Created At */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Joined</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(user.createdAt)}</p>
                    </div>

                    {/* Last Updated */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-100 dark:border-red-900 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">Last Updated</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(user.updatedAt)}</p>
                    </div>
                </div>

                {/* Block Status Alert */}
                {user.isBlocked && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 backdrop-blur-sm">
                        <p className="text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            This user is currently blocked
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserAllDetails