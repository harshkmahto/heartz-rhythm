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
  Filter,
  X,
  Eye,
  Clock,
  IndianRupee
} from 'lucide-react';
import { getAllProducts } from '../../../utils/product.apiRequest';
import BlockProducts from '../../../components/Admin/products/BlockProducts';

const AllBlockedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBlockPopup, setShowBlockPopup] = useState(false);
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
        limit: pagination.limit,
        isBlocked: true 
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await getAllProducts(params);
      if (response.success) {
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

  const handleUnblockClick = (product) => {
    setSelectedProduct(product);
    setShowBlockPopup(true);
  };

  const handleCloseBlockPopup = () => {
    setShowBlockPopup(false);
    setSelectedProduct(null);
  };

  const handleBlockSuccess = (updatedProduct) => {
    setProducts(prev => prev.filter(p => p._id !== updatedProduct._id));
    fetchBlockedProducts();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.basePrice));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
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
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Ban className="text-red-600 dark:text-red-400" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blocked Products</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage products that are restricted from public view
                </p>
              </div>
            </div>
            <button
              onClick={fetchBlockedProducts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Blocked Products</p>
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
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-2xl p-12 text-center border border-red-100 dark:border-red-900/30">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={40} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Blocked Products</h3>
            <p className="text-gray-600 dark:text-gray-400">
              There are no blocked products at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-black rounded-2xl overflow-hidden border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-red-50 dark:bg-red-950/10">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-red-300 dark:text-red-700" />
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
                  <p className="text-red-600 dark:text-red-400 text-sm mb-2">
                    {product.brand}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <Package size={14} />
                    <span>Stock: {product.totalStock || 0}</span>
                    <span className="mx-1">•</span>
                    <IndianRupee size={14} />
                    <span>From {formatPrice(getLowestPrice(product.variants))}</span>
                  </div>

                  {product.blockReason && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Block Reason:</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                        {product.blockReason}
                      </p>
                      {product.blockedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={10} />
                          Blocked on: {new Date(product.blockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-500">
                    <User size={12} />
                    <span>{product.seller?.name || 'Unknown Seller'}</span>
                  </div>

                  {/* Unblock Button */}
                  <button
                    onClick={() => handleUnblockClick(product)}
                    className="w-full py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Shield size={16} />
                    Unblock Product
                  </button>
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
              className="px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Unblock Popup */}
      {showBlockPopup && selectedProduct && (
        <BlockProducts
          product={selectedProduct}
          productId={selectedProduct._id}
          onClose={handleCloseBlockPopup}
          onBlockSuccess={handleBlockSuccess}
        />
      )}
    </div>
  );
};

export default AllBlockedProducts;