import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Shield, 
  Ban, 
  User, 
  Calendar,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Search,
  Clock,
  XCircle,
  IndianRupee
} from 'lucide-react';
import { getMyProducts } from '../../utils/product.apiRequest';

const MyBlockedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12
  });

  const fetchBlockedProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await getMyProducts(params);
      if (response.success) {
        // Filter only blocked products from seller's products
        const blockedProducts = response.data.products.filter(p => p.isBlocked === true);
        setProducts(blockedProducts);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalProducts: response.data.pagination.totalProducts
        }));
      }
    } catch (error) {
      console.error('Error fetching blocked products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedProducts();
  }, [pagination.currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get lowest price from variants
  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.basePrice));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blocked products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Ban className="text-green-600 dark:text-green-400" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blocked Products</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Products that have been blocked by admin
                </p>
              </div>
            </div>
            <button
              onClick={fetchBlockedProducts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Blocked Products</p>
              <p className="text-4xl font-bold text-white">{products.length}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl">
              <Ban size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search blocked products..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-green-200 dark:border-green-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-2xl p-12 text-center border border-green-100 dark:border-green-900/30">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={40} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Blocked Products</h3>
            <p className="text-gray-600 dark:text-gray-400">
              None of your products are currently blocked.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-black rounded-2xl overflow-hidden border border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-all"
              >
                {/* Product Image */}
                
                <div className="relative h-48 bg-green-50 dark:bg-green-950/10">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-green-300 dark:text-green-700" />
                    </div>
                  )}
                  {/* Blocked Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-red-600 text-white text-xs rounded-lg flex items-center gap-1">
                    <Ban size={12} />
                    Blocked
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 text-sm mb-2">
                    {product.brand}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <Package size={14} />
                    <span>Stock: {product.totalStock || 0}</span>
                    <span className="mx-1">•</span>
                    <IndianRupee size={14} />
                    <span>From {formatPrice(getLowestPrice(product.variants))}</span>
                  </div>

                  {/* Category & Subcategory */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Category: {product.category}
                      {product.subCategory && ` > ${product.subCategory}`}
                    </p>
                  </div>

                  {/* Block Reason */}
                  {product.blockReason && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Block Reason:</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {product.blockReason}
                      </p>
                      {product.blockedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                          <Clock size={10} />
                          Blocked on: {new Date(product.blockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Product Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : product.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <XCircle size={16} className="text-red-500" />
                  </div>

                  {/* Info Note */}
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Contact Team for more information
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlockedProducts;