import React, { useEffect, useState } from 'react'
import { 
  Search, X, Copy, Check, 
  Users, Calendar, Mail, Phone, 
  Eye, Edit, Trash2, ChevronLeft, ChevronRight,
  Ban, AlertCircle, UserX,
  PencilLine
} from 'lucide-react'
import { getAllUser } from '../../../utils/apiRequest'
import UserAllDetails from '../../../components/Admin/UserAllDetails'
import UpdateUserRole from '../../../components/Admin/UpdateUserRole'
import UserProfile from '../../../components/Admin/UserProfile'

const AllBlockedUsers = () => {
    const [users, setUsers] = useState([])
    const [blockedUsers, setBlockedUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(15)
    const [copiedId, setCopiedId] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showprofileModal, setShowProfileModal] = useState(false)


    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await getAllUser()
      
            
            let usersData = []
            if (response && response.users) {
                usersData = response.users
            } else if (response && Array.isArray(response)) {
                usersData = response
            } else if (response && response.data && response.data.users) {
                usersData = response.data.users
            }
            
            setUsers(usersData)
            // Filter only blocked users (isBlocked === true)
            const blocked = usersData.filter(user => user.isBlocked === true)
            setBlockedUsers(blocked)
            setError(null)
        } catch (err) {
            console.error('Error fetching users:', err)
            setError(err.response?.data?.message || 'Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredUsers = blockedUsers.filter(user => {
        const matchesSearch = searchTerm === '' || 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        
        return matchesSearch && matchesRole
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    const getRoleBadgeClass = (role) => {
        switch(role) {
            case 'admin':
                return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            case 'seller':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
            case 'customer':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
        }
    }

    const getInitials = (name) => name?.charAt(0)?.toUpperCase() || 'U'

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                        <Ban className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blocked users...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button onClick={fetchUsers} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
                        Try Again
                    </button>
                </div>
            </div>
        )
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
                            <Ban className="w-4 h-4 text-red-600 dark:text-red-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">Blocked Users Management</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4">
                            BLOCKED USERS
                            <span className="text-red-600 dark:text-red-500">.</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            Manage and monitor all blocked users on your platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                                <UserX className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{blockedUsers.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Total Blocked Users</p>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                                <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Total Users</p>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {((blockedUsers.length / users.length) * 100).toFixed(1) || 0}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Blocked Percentage</p>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                                <Calendar className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{new Date().getFullYear()}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Current Year</p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-red-500 cursor-pointer"
                            >
                                <option value="all">All Roles</option>
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Blocked Users Table */}
                <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden mb-8 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                                <tr className="text-left text-gray-600 dark:text-gray-400 text-sm">
                                    <th className="px-6 py-4">USER</th>
                                    <th className="px-6 py-4">CONTACT</th>
                                    <th className="px-6 py-4">ROLE</th>
                                    <th className="px-6 py-4">JOINED</th>
                                    <th className="px-6 py-4">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition ">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div 
                                                            onClick={() => { setSelectedUser(user); setShowProfileModal(true); }} 
                                                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold cursor-pointer">
                                                            {user.profilePicture?.url ? (
                                                                <img src={user.profilePicture.url} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                                                            ) : (
                                                                getInitials(user.name)
                                                            )}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black bg-red-500"></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</p>
                                                        <code className="text-xs text-gray-500 dark:text-gray-500">{user.id?.slice(0, 12)}...</code>
                                                        <button 
                                                            onClick={() => copyToClipboard(user.id, user.id)} 
                                                            className="ml-1 hover:text-red-600 dark:hover:text-red-400 transition"
                                                        >
                                                            {copiedId === user.id ? <Check className="w-3 h-3 text-green-500 inline" /> : <Copy className="w-3 h-3 text-gray-400 inline" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs rounded-lg ${getRoleBadgeClass(user.role)}`}>
                                                    {user.role || 'customer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => { setSelectedUser(user); setShowModal(true); }} 
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition cursor-pointer"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }} 
                                                        lassName="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition cursor-pointer" title="Edit">
                                                        <PencilLine className="w-4 h-4 text-gray-600 dark:text-gray-400 cursor-pointer" />
                                                    </button>
                                                   
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Ban className="w-12 h-12 text-gray-400" />
                                                <p>No blocked users found</p>
                                                <p className="text-sm text-gray-400">Users who are blocked will appear here</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} blocked users
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                    disabled={currentPage === 1} 
                                    className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-red-600 hover:text-white transition cursor-pointer"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 bg-red-600 text-white rounded-lg">{currentPage}</span>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                    disabled={currentPage === totalPages} 
                                    className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-red-600 hover:text-white transition cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Alert when no blocked users */}
                {blockedUsers.length === 0 && !loading && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-medium">No blocked users found</p>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                            All users are currently active. When a user gets blocked, they will appear here.
                        </p>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <UserAllDetails 
                            userId={selectedUser.id} 
                            onClose={() => setShowModal(false)} 
                        />
                    </div>
                </div>
            )}

            {/* User Update Modal */}
            {showUpdateModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <UpdateUserRole
                            userId={selectedUser.id} 
                            onClose={() => setShowUpdateModal(false)} 
                        />
                    </div>
                </div>
            )}
             {/* User Update Modal */}
            {showprofileModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <UserProfile
                            userId={selectedUser.id} 
                            onClose={() => setShowProfileModal(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllBlockedUsers