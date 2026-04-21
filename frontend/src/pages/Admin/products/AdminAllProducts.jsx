// AdminAllProducts.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminProductCard from '../../../components/Admin/products/AdminProductCard'
import { getAllProducts } from '../../../utils/product.apiRequest' 
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const AdminAllProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12
  })
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({
    activeProducts: 0,
    draftProducts: 0,
    scheduledProducts: 0,
    featuredProducts: 0,
    totalStock: 0,
    totalSold: 0
  })

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedCategory && { category: selectedCategory })
      })
      
      const response = await getAllProducts(params)
      if (response.success) {
        setProducts(response.data.products)
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalProducts: response.data.pagination.totalProducts
        }))
        setStats(response.data.stats)
        
        // Extract unique categories from products for filter dropdown
        const uniqueCategories = [...new Set(response.data.products.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [pagination.currentPage, selectedStatus, selectedCategory])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination(prev => ({ ...prev, currentPage: 1 }))
      } else {
        fetchProducts()
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStatus('')
    setSelectedCategory('')
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleProductClick = (productId) => {
    navigate(`/admin/product/details/${productId}`)
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-rose-950 dark:via-black dark:to-red-950 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-700 dark:text-red-500 border-l-4 border-red-600 dark:border-red-500 pl-4">
            Admin All Products
          </h1>
          <p className="text-black dark:text-white/70 mt-2 ml-4">
            Manage and monitor all products across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-4 border-l-4 border-red-500 dark:border-red-500 shadow-black/5 dark:shadow-white/5">
            <p className="text-sm text-black/60 dark:text-white/50">Total Products</p>
            <p className="text-2xl font-bold text-black dark:text-white">{pagination.totalProducts}</p>
          </div>
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-4 border-l-4 border-green-500 dark:border-green-500 shadow-black/5 dark:shadow-white/5">
            <p className="text-sm text-black/60 dark:text-white/50">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeProducts}</p>
          </div>
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-4 border-l-4 border-yellow-500 dark:border-yellow-500 shadow-black/5 dark:shadow-white/5">
            <p className="text-sm text-black/60 dark:text-white/50">Draft</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draftProducts}</p>
          </div>
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-4 border-l-4 border-blue-500 dark:border-blue-500 shadow-black/5 dark:shadow-white/5">
            <p className="text-sm text-black/60 dark:text-white/50">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.scheduledProducts}</p>
          </div>
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-4 border-l-4 border-purple-500 dark:border-purple-500 shadow-black/5 dark:shadow-white/5">
            <p className="text-sm text-black/60 dark:text-white/50">Featured</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.featuredProducts}</p>
          </div>
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-4 border-l-4 border-red-500 dark:border-red-500 shadow-black/5 dark:shadow-white/5">
            <p className="text-sm text-black/60 dark:text-white/50">Total Sold</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.totalSold}</p>
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div className="bg-white dark:bg-black/80 rounded-lg shadow-md mb-6 overflow-hidden border border-red-100 dark:border-red-900/30">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <FiFilter className="text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-800 dark:text-red-300">Filter Products</span>
              {(selectedStatus || selectedCategory || searchTerm) && (
                <span className="bg-red-600 dark:bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                  Active Filters
                </span>
              )}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); clearFilters(); }}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <FiX size={16} />
              Clear all
            </button>
          </div>
          
          {showFilters && (
            <div className="p-4 border-t border-red-100 dark:border-red-900/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 dark:text-red-400" />
                  <input
                    type="text"
                    placeholder="Search by title, brand, or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
                  />
                </div>
                
                {/* Status Filter */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-black dark:text-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-black dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Filter Help Text */}
              <div className="mt-3 text-xs text-black/50 dark:text-white/40 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Apply filters to narrow down products
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active products are visible to customers
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedStatus || selectedCategory || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-sm px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-red-600 dark:hover:text-red-400">
                  <FiX size={14} />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-sm px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('')} className="hover:text-red-600 dark:hover:text-red-400">
                  <FiX size={14} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-sm px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-red-600 dark:hover:text-red-400">
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 dark:border-red-500 border-t-transparent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-black/80 rounded-lg shadow-md p-12 text-center border border-red-100 dark:border-red-900/30">
            <p className="text-black dark:text-white text-lg">No products found</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <AdminProductCard
                key={product._id}
                product={product}
                onClick={() => handleProductClick(product._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-black/80 border border-red-200 dark:border-red-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center gap-2 text-black dark:text-white"
            >
              <FiChevronLeft size={18} />
              Previous
            </button>
            <span className="px-4 py-2 text-black dark:text-white">
              Page <span className="font-bold text-red-600 dark:text-red-400">{pagination.currentPage}</span> of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-black/80 border border-red-200 dark:border-red-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center gap-2 text-black dark:text-white"
            >
              Next
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAllProducts