import React, { useEffect, useState } from 'react'
import { 
  Store, Search, X, Copy, Check, 
  TrendingUp, Users, Award, Calendar, 
  Mail, Phone, Eye, Edit, Trash2, ChevronLeft, ChevronRight,
  Clock, Verified
} from 'lucide-react'
import { getAllSeller } from '../../../utils/apiRequest'
import UserAllDetails from '../../../components/Admin/UserAllDetails'
import { useNavigate } from 'react-router-dom'
import UpdateUserRole from '../../../components/Admin/UpdateUserRole'
import DeleteUsers from '../../../components/Admin/DeleteUsers'

const AllSellers = () => {
    const [sellers, setSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [copiedId, setCopiedId] = useState(null)
    const [selectedSeller, setSelectedSeller] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [viewMode, setViewMode] = useState('grid')
    const [updateModel, setUpdateModel] = useState(false)
    const [deleteModel, setDeleteModel] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchSellers()
    }, [])

    const fetchSellers = async () => {
        try {
            setLoading(true)
            const response = await getAllSeller()
            let sellersData = []
            if (response && response.sellers) {
                sellersData = response.sellers
            } else if (response && Array.isArray(response)) {
                sellersData = response
            } else if (response && response.data && response.data.sellers) {
                sellersData = response.data.sellers
            }
            setSellers(sellersData)
            setError(null)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch sellers')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = searchTerm === '' || 
            seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            seller.id?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || seller.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentSellers = filteredSellers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredSellers.length / itemsPerPage)

    const getInitials = (name) => name?.charAt(0)?.toUpperCase() || 'S'

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    // FIXED: Pass the seller ID directly to navigate
    const handleViewProfile = (sellerId) => {
        navigate(`/admin/seller-profile/${sellerId}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                        <Store className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sellers...</p>
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
                    <button onClick={fetchSellers} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
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
                            <Store className="w-4 h-4 text-red-600 dark:text-red-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">Seller Management</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4">
                            SELLERS
                            <span className="text-red-600 dark:text-red-500">.</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            Manage and monitor all registered sellers on your platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition">
                                <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Total Sellers</p>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-green-400 dark:hover:border-green-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-500/20 transition">
                                <Award className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.filter(s => s.status === 'active').length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Active Sellers</p>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-500/20 transition">
                                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.filter(s => s.status === 'pending').length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Pending Approval</p>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition">
                                <Verified className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.filter(s => s.verified).length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Verified Sellers</p>
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
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-red-500 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="review">Review</option>
                            </select>
                            
                            <div className="flex gap-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentSellers.map((seller) => (
                                <div key={seller.id} className="group relative bg-white dark:bg-zinc-900/30 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition"></div>
                                    
                                    <div className="relative p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="relative">
                                                <div
                                                    onClick={() => { setSelectedSeller(seller); setShowModal(true); }} 
                                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg cursor-pointer"
                                                >
                                                    {seller.profilePicture?.url ? (
                                                        <img src={seller.profilePicture.url} alt={seller.name} className="w-full h-full rounded-2xl object-cover" />
                                                    ) : (
                                                        getInitials(seller.name)
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black ${seller.status === 'active' ? 'bg-green-500' : seller.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{seller.name}</h3>
                                            <div className="flex items-center gap-2 text-sm">
                                                <code className="text-xs text-gray-500 dark:text-gray-400">{seller.id?.slice(0, 10)}...</code>
                                                <button onClick={() => copyToClipboard(seller.id, seller.id)} className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer">
                                                    {copiedId === seller.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{seller.email}</span>
                                            </div>
                                            {seller.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{seller.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                <span>Joined {formatDate(seller.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            <span className={`px-2 py-1 text-xs rounded-lg ${
                                                seller.status === 'active' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20' 
                                                    : seller.status === 'pending' 
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20' 
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20'
                                            }`}>
                                                {seller.status}
                                            </span>
                                            {seller.verified && (
                                                <span className="px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                                    Verified
                                                </span>
                                            )}
                                            <span className="px-2 py-1 text-xs rounded-lg bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                                                Seller
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                            <button 
                                                onClick={() => handleViewProfile(seller.id)}
                                                className="flex-1 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-gray-700 dark:text-white text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <Eye className="w-3 h-3" /> View
                                            </button>
                                            <button 
                                                onClick={() => {setSelectedSeller(seller); setUpdateModel(true)}}
                                                className="flex-1 py-2 bg-red-100 dark:bg-red-600/20 hover:bg-red-600 dark:hover:bg-red-600 rounded-lg text-red-600 dark:text-red-400 hover:text-white text-sm transition flex items-center justify-center gap-2 cursor-pointer">
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <button 
                                                onClick={() =>{ setSelectedSeller(seller); setDeleteModel(true)}}
                                                className="flex-1 py-2 bg-red-100 dark:bg-red-600/20 hover:bg-red-600 dark:hover:bg-red-600 rounded-lg text-red-600 dark:text-red-400 hover:text-white text-sm transition flex items-center justify-center gap-2 cursor-pointer">
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mb-8">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                    disabled={currentPage === 1} 
                                    className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = currentPage;
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;
                                    
                                    return (
                                        <button 
                                            key={pageNum} 
                                            onClick={() => setCurrentPage(pageNum)} 
                                            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                                                currentPage === pageNum 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-zinc-800'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                    disabled={currentPage === totalPages} 
                                    className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="bg-white dark:bg-zinc-900/30 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden mb-8 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                                    <tr className="text-left text-gray-600 dark:text-gray-400 text-sm">
                                        <th className="px-6 py-4">Seller</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    {currentSellers.map((seller) => (
                                        <tr key={seller.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        onClick={() => { setSelectedSeller(seller); setShowModal(true); }}
                                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold cursor-pointer"
                                                    >
                                                        {seller.profilePicture?.url ? (
                                                            <img src={seller.profilePicture.url} alt={seller.name} className="w-full h-full rounded-xl object-cover" />
                                                        ) : (
                                                            getInitials(seller.name)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{seller.name}</p>
                                                        <code className="text-xs text-gray-500 dark:text-gray-500">{seller.id?.slice(0, 12)}...</code>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 dark:text-gray-300">{seller.email}</div>
                                                {seller.phone && <div className="text-xs text-gray-500 dark:text-gray-500">{seller.phone}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs rounded-lg ${
                                                    seller.status === 'active' 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                                                        : seller.status === 'pending' 
                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' 
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                                                }`}>
                                                    {seller.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(seller.createdAt)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleViewProfile(seller.id)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition cursor-pointer"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {setSelectedSeller(seller); setUpdateModel(true)}}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition cursor-pointer" title="Edit">
                                                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {setSelectedSeller(seller); setDeleteModel(true)}}
                                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer" title="Delete">
                                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSellers.length)} of {filteredSellers.length}
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
                )}
            </div>

            {/* Seller Details Modal */}
            {showModal && selectedSeller && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <UserAllDetails 
                            userId={selectedSeller.id} 
                            onClose={() => setShowModal(false)} 
                        />
                    </div>
                </div>
            )}

             {/* Update Modal */}
            {updateModel && selectedSeller && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <UpdateUserRole
                            userId={selectedSeller.id} 
                            onClose={() => setUpdateModel(false)} 
                        />
                    </div>
                </div>
            )}

             {/* Delete Modal */}
            {deleteModel && selectedSeller && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DeleteUsers
                            userId={selectedSeller.id} 
                            onClose={() => setDeleteModel(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllSellers