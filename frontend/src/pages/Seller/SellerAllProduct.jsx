import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, ChevronDown, ChevronUp, AlertCircle, 
  Package, ShoppingBag, Zap, Store, Calendar, X
} from 'lucide-react';
import { getMyProducts } from '../../utils/product.apiRequest';
import SellerProductCard from '../..//components/Seller/Products/SellerProductCard';
import ProductStatusUpdate from '../..//components/Seller/Products/ProductStatusUpdate';

const SellerAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Modal state - lifted up
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    scheduled: 0
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products when any filter changes
  useEffect(() => {
    fetchProducts();
  }, [statusFilter, categoryFilter, subCategoryFilter, sortBy, debouncedSearchTerm]);

  const fetchProducts = async () => {
    try {
      setIsFiltering(true);
      setLoading(true);
      
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (subCategoryFilter !== 'all') params.append('subCategory', subCategoryFilter);
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      
      let sortField = 'createdAt';
      let sortOrder = 'desc';
      if (sortBy === 'oldest') {
        sortOrder = 'asc';
      } else if (sortBy === 'priceLow') {
        sortField = 'variants.basePrice';
        sortOrder = 'asc';
      } else if (sortBy === 'priceHigh') {
        sortField = 'variants.basePrice';
        sortOrder = 'desc';
      }
      params.append('sortBy', sortField);
      params.append('sortOrder', sortOrder);
      
      const response = await getMyProducts(params);
      
      if (response.success) {
        setProducts(response.data.products);
        
        // Extract unique categories and subcategories from ALL products (not filtered)
        const allProductsResponse = await getMyProducts();
        if (allProductsResponse.success) {
          const uniqueCategories = [...new Set(allProductsResponse.data.products.map(p => p.category))];
          const uniqueSubCategories = [...new Set(allProductsResponse.data.products.map(p => p.subCategory).filter(Boolean))];
          setCategories(uniqueCategories);
          setSubCategories(uniqueSubCategories);
        }
        
        // Calculate stats from filtered products
        const total = response.data.products.length;
        const active = response.data.products.filter(p => p.status === 'active').length;
        const draft = response.data.products.filter(p => p.status === 'draft').length;
        const scheduled = response.data.products.filter(p => p.status === 'scheduled').length;
        setStats({ total, active, draft, scheduled });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  // Handle status update click
  const handleStatusUpdateClick = (product) => {
    setSelectedProduct(product);
    setShowStatusModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowStatusModal(false);
    setSelectedProduct(null);
  };

  // Handle refresh after status update
  const handleRefresh = () => {
    fetchProducts();
  };

  // Handle search input change with two-way binding
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSubCategoryFilter('all');
    setSortBy('newest');
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const StatCard = ({ title, count, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-4 border border-green-200/50 dark:border-green-800/30 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-700 dark:text-green-400">{title}</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{count}</p>
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  // Show loading only on initial load
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700 dark:text-green-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            My Products
          </h1>
          <p className="text-green-600 dark:text-green-400 mt-2">Manage and track all your products</p>
        </div>

        {/* Create Product Button */}
        <div className="flex justify-center mb-8">
          <Link to="/seller/product/create">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              <Plus size={20} />
              Create New Product
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Products" 
            count={stats.total} 
            icon={Package}
            color="bg-green-100 dark:bg-green-900/50 text-green-600"
            bgColor="bg-white/80 dark:bg-black/40"
          />
          <StatCard 
            title="Active" 
            count={stats.active} 
            icon={ShoppingBag}
            color="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600"
            bgColor="bg-white/80 dark:bg-black/40"
          />
          <StatCard 
            title="Draft" 
            count={stats.draft} 
            icon={Zap}
            color="bg-amber-100 dark:bg-amber-900/50 text-amber-600"
            bgColor="bg-white/80 dark:bg-black/40"
          />
          <StatCard 
            title="Scheduled" 
            count={stats.scheduled} 
            icon={Calendar}
            color="bg-blue-100 dark:bg-blue-900/50 text-blue-600"
            bgColor="bg-white/80 dark:bg-black/40"
          />
        </div>

        {/* Search and Filter Panel */}
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-green-200 dark:border-green-800 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
            <input
              type="text"
              placeholder="Search products by title, category, or brand..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-600 transition-colors mb-4 cursor-pointer"
          >
            <Filter size={18} />
            <span className="font-medium">Filters</span>
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-green-200 dark:border-green-700">
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Sub Category</label>
                <select
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
                  disabled={subCategories.length === 0}
                >
                  <option value="all">All Sub Categories</option>
                  {subCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(statusFilter !== 'all' || categoryFilter !== 'all' || subCategoryFilter !== 'all' || searchTerm) && (
            <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-green-600 dark:text-green-400">Active filters:</span>
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:text-red-500 ml-1">×</button>
                  </span>
                )}
                {categoryFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter('all')} className="hover:text-red-500 ml-1">×</button>
                  </span>
                )}
                {subCategoryFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    Sub Category: {subCategoryFilter}
                    <button onClick={() => setSubCategoryFilter('all')} className="hover:text-red-500 ml-1">×</button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    Search: {searchTerm}
                    <button onClick={clearSearch} className="hover:text-red-500 ml-1">×</button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading indicator for filter changes */}
        {isFiltering && products.length > 0 && (
          <div className="flex justify-center py-4 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {products.length === 0 && !error && !isFiltering && (
          <div className="text-center py-12 bg-white/80 dark:bg-black/40 rounded-2xl border border-green-200 dark:border-green-800">
            <Store className="w-16 h-16 text-green-300 dark:text-green-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">No Products Found</h3>
            <p className="text-green-600 dark:text-green-400 mb-6">Get started by creating your first product</p>
            <Link to="/seller/product/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold mx-auto cursor-pointer transition-all hover:scale-105">
                <Plus size={18} />
                Create Product
              </button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <SellerProductCard 
              key={product._id} 
              product={product} 
              onRefresh={fetchProducts}
              onStatusUpdateClick={handleStatusUpdateClick}
            />
          ))}
        </div>
      </div>

      {/* Status Update Modal - Rendered at root level */}
      {showStatusModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <ProductStatusUpdate
            productId={selectedProduct._id}
            onClose={handleCloseModal}
            onRefresh={handleRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default SellerAllProduct;