import React, { useEffect, useState, useRef } from 'react'
import RoundedText from '../../../components/ShowCaseSection/RoundedText'
import { ArrowLeft, ArrowRight, PencilIcon, Trash2, Search, Filter, X, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllUser } from '../../../utils/apiRequest'
import UserAllDetails from '../../../components/Admin/UserAllDetails'
import UpdateUserRole from '../../../components/Admin/UpdateUserRole'
import DeleteUsers from '../../../components/Admin/DeleteUsers'

const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [roleFilter, setRoleFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(30)
    const [copiedId, setCopiedId] = useState(null)
    const [userPopup, setuserPopup] = useState(false)
    const [updatePopup, setUpdatePopup] = useState(false)
    const [selectUserId, setSelectUserId] = useState(null)
    const [deletePopup, setDeletePopup] = useState(false)
    
    const scrollContainerRef = useRef(null)

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

    // Horizontal scroll functions
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' || 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id?.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        
        return matchesSearch && matchesStatus && matchesRole
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'active':
                return 'bg-green-100 text-red-800 dark:bg-green-900/30 dark:text-green-400'
            case 'review':
                 return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-600'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const getRoleBadgeClass = (role) => {
        switch(role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'seller':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            case 'customer':
                return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const getInitials = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'U'
    }


    const handleUser = (userId) => {
      setSelectUserId(userId)
      setuserPopup(true)
    }
    const handleClose = () => {
      setuserPopup(false)
      setSelectUserId(null)
    }

   const handleUpdate = (userId) => {
    setSelectUserId(userId)
    setUpdatePopup(true)
   }
   const handleCloseUpdate = () => {
    setUpdatePopup(false)
    setSelectUserId(null)
   }
    
   const handleDelete = (userId) => {
    setSelectUserId(userId)
    setDeletePopup(true)
   }
   const handleCloseDelete = () => {
    setDeletePopup(false)
    setSelectUserId(null)
   }





    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">Loading users...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button 
                        onClick={fetchUsers}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen  p-4 md:p-6'>
            <div className='text-center mb-6'>
                <p className='text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500'>
                   ALL USERS
                </p>
            </div>
            
            <div className='max-w-full mx-auto'>
                

                <p className='border-b border-red-200 dark:border-red-800/50 w-full mt-5 mb-6'></p>

                {/* Filter Panel */}
                <div className='bg-white/80 dark:bg-black backdrop-blur-sm  rounded-xl shadow-lg mb-6 overflow-hidden border border-red-100 dark:border-red-900/30'>
                    <div className='border-b border-red-100 dark:border-red-900 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-black'>
                        <span className='flex justify-center'>
                            <RoundedText text="Filter Panel"/>
                        </span>
                    </div>
                    <div className='p-4'>
                        <div className='flex flex-wrap gap-4 items-end'>
                            <div className='flex-1 min-w-[200px]'>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">Search User</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    <input 
                                        type="search" 
                                        placeholder='Search by name, email or ID...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='w-full pl-10 pr-4 py-2 border border-red-200 dark:border-red-800/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white'
                                    />
                                </div>
                            </div>
                            <div className='min-w-[150px]'>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">Status</label>
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className='w-full px-3 py-2 border border-red-200 dark:border-red-800/50 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="review">Review</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div className='min-w-[150px]'>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">Role</label>
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className='w-full px-3 py-2 border border-red-200 dark:border-red-800/50 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                >
                                    <option value="all">All Roles</option>
                                    <option value="customer">Customer</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                           
                        </div>
                    </div>
                </div>

                {/* Users List Section */}
                <div className='mb-4'>
                    <span className='flex justify-center items-center mb-4'>
                        <RoundedText text="Users List"/>
                    </span>
                    
                    {/* Pagination Controls (Top) */}
                    <div className='flex items-center justify-between mb-3'>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className='flex items-center gap-3'>
                            <button 
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className='bg-white dark:bg-gray-800 shadow-md p-2 rounded-full cursor-pointer active:scale-95 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                            >
                                <ChevronLeft className='w-4 h-4'/>
                            </button>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className='bg-white dark:bg-gray-800 shadow-md p-2 rounded-full cursor-pointer active:scale-95 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                            >
                                <ChevronRight className='w-4 h-4'/>
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Scroll Controls (Top) */}
                    <div className='flex items-center justify-between gap-4 mb-3'>
                        <button 
                            onClick={scrollLeft}
                            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-105 cursor-pointer'
                            title="Scroll Left"
                        >
                            <ArrowLeft className='w-5 h-5'/>
                        </button>
                        <div className="flex-1 text-center text-xs text-red-600 dark:text-red-400 font-medium">
                            ← Scroll horizontally to see all columns →
                        </div>
                        <button 
                            onClick={scrollRight}
                            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-105 cursor-pointer'
                            title="Scroll Right"
                        >
                            <ArrowRight className='w-5 h-5'/>
                        </button>
                    </div>

                    {/* Table Header - Sticky */}
                    <div className='sticky top-0 z-10 grid grid-cols-7 gap-4 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-800 dark:to-orange-800 p-3 rounded-t-lg font-semibold text-white text-sm shadow-md'>
                        <div className="col-span-1">PROFILE</div>
                        <div className="col-span-2">NAME / ID</div>
                        <div className="col-span-2">EMAIL</div>
                        <div className="col-span-1">ROLE / STATUS</div>
                        <div className="col-span-1">ACTIONS</div>
                    </div>
                </div>

                {/* Users List with Horizontal Scroll */}
                <div 
                    ref={scrollContainerRef}
                    className="overflow-x-auto pb-4 scrollbar-thin scrollbar-track-red-100 scrollbar-thumb-red-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-red-700"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#dc2626 #fecaca' }}
                >
                    <div className="min-w-250">
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <div 
                                    key={user.id} 
                                    className={`grid grid-cols-7 gap-4 items-center p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 ${
                                        index !== currentUsers.length - 1 ? 'border-b border-red-100 dark:border-red-900/30' : ''
                                    }`}
                                >
                                    {/* Profile */}
                                    <div className="col-span-1">
                                        <div 
                                        onClick={() => handleUser(user.id)}
                                         className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-red-300 dark:ring-red-700 cursor-pointer">
                                            {user?.profilePicture?.url ? (
                                                <img 
                                                    src={user?.profilePicture?.url} 
                                                    alt={user.name} 
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                getInitials(user.name)
                                            )}
                                        </div>
                                    </div>

                                    {/* Name and ID */}
                                    <div className="col-span-2">
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {user.name || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <code className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                                                {user.id?.slice(0, 8)}...
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(user.id, user.id)}
                                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors cursor-pointer"
                                                title="Copy ID"
                                            >
                                                {copiedId === user.id ? (
                                                    <Check className="w-3 h-3 text-green-600" />
                                                ) : (
                                                    <Copy className="w-3 h-3 text-red-500 hover:text-red-700" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-2">
                                        <div className="text-sm text-gray-600 dark:text-gray-300 break-all">
                                            {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                📞 {user.phone}
                                            </div>
                                        )}
                                    </div>

                                    {/* Role & Status */}
                                    <div className="col-span-1">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 py-1 text-xs rounded-full text-center font-medium ${getRoleBadgeClass(user.role)}`}>
                                                {user.role || 'customer'}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full text-center ${getStatusBadgeClass(user.status)}`}>
                                                {user.status || 'active'}
                                            </span>
                                            {user.verified !== undefined && (
                                                <span className={`px-2 py-1 text-xs rounded-full text-center ${user.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.verified ? '✓ Verified' : '✗ Not Verified'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() =>handleUpdate(user.id)}
                                                className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors cursor-pointer">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No users found
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Scrollbar Indicator */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-red-600 dark:text-red-400">
                    <ArrowLeft className="w-3 h-3" />
                    <span>Scroll horizontally</span>
                    <ArrowRight className="w-3 h-3" />
                </div>

                {/* Bottom Pagination */}
                <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-900/30 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        📊 Total Users: {filteredUsers.length}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white transition-all duration-200 font-medium"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">
                            {currentPage}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white transition-all duration-200 font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

           {userPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
              <UserAllDetails 
                onClose={handleClose}
                userId ={selectUserId}
            
                />
            </div>
            </div>
           )}   

           {updatePopup && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
              
              <UpdateUserRole
                onClose={handleCloseUpdate}
                userId ={selectUserId} />
            </div>
            </div>
           )}   

           {deletePopup && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
              
              <DeleteUsers
                onClose={handleCloseDelete}
                userId ={selectUserId} />
            </div>
            </div>
            )}       


        </div>
    )
}

export default AllUsers