// Shop.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ChevronLeft, ChevronRight, Loader, X, Sparkles, Sliders } from 'lucide-react';
import ShopProductCard from '../../components/Products/ShopProductCard';
import { getAllPublicProducts } from '../../utils/product.apiRequest'; 

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12
  });
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    search: '',
    isFeatured: false
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    colors: [],
    priceRange: { min: 0, max: 100000 }
  });

  // Check screen size
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsFilterOpen(!mobile);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.limit);
      
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.color) params.append('color', filters.color);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.isFeatured) params.append('featured', 'true');
      
      const response = await getAllPublicProducts(params);
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalProducts: response.data.pagination.totalProducts,
          limit: response.data.pagination.limit
        });
        setFilterOptions({
          categories: response.data.filters.categories || [],
          brands: response.data.filters.brands || [],
          colors: response.data.filters.colors || [],
          priceRange: response.data.filters.priceRange || { min: 0, max: 100000 }
        });
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    handleFilterChange('search', searchValue);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      search: '',
      isFeatured: false
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value && key !== 'sortBy' && key !== 'search'
  ).length;

  // Filter Sidebar Component (reused for both desktop and mobile)
  const FilterSidebar = ({ onClose }) => (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-red-200 dark:border-red-900 flex items-center justify-between">
        <h3 className="font-bold text-xl flex items-center gap-2 text-black dark:text-white">
          <Sliders size={20} className="text-red-500" /> Filters
        </h3>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
              Clear all
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
              <X size={20} className="text-black dark:text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50" size={18} />
          <input 
            name="search"
            defaultValue={filters.search}
            className="w-full bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-xl pl-10 pr-4 py-3 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:outline-none focus:border-red-500"
            placeholder="Search instruments..."
            type="text"
          />
        </form>

        {/* Featured Toggle */}
        <div className="pb-6 border-b border-red-200 dark:border-red-900">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-black dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-red-500" />
              Featured Products
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.isFeatured}
                onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-all duration-300 ${filters.isFeatured ? 'bg-red-500' : 'bg-red-200 dark:bg-red-900'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${filters.isFeatured ? 'translate-x-5' : ''}`} />
              </div>
            </div>
          </label>
        </div>

        {/* Price Range */}
        <div className="pb-6 border-b border-red-200 dark:border-red-900">
          <label className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 font-bold mb-3 block">
            Price Range (₹)
          </label>
          <div className="flex flex-col  gap-3">
            <input 
              type="number"
              placeholder={`₹${filterOptions.priceRange.min}`}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="flex-1 bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-black dark:text-white"
            />
            <input 
              type="number"
              placeholder={`₹${filterOptions.priceRange.max}`}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="flex-1 bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 text-black dark:text-white"
            />
          </div>
        </div>

        {/* Categories */}
        {filterOptions.categories.length > 0 && (
          <div className="pb-6 border-b border-red-200 dark:border-red-900">
            <label className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 font-bold mb-3 block">
              Categories
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('category', '')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm ${
                  !filters.category 
                    ? 'bg-red-500 text-white' 
                    : 'text-black dark:text-white hover:bg-red-50 dark:hover:bg-red-950'
                }`}
              >
                All Categories
              </button>
              {filterOptions.categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleFilterChange('category', cat._id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex justify-between ${
                    filters.category === cat._id 
                      ? 'bg-red-500 text-white' 
                      : 'text-black dark:text-white hover:bg-red-50 dark:hover:bg-red-950'
                  }`}
                >
                  <span>{cat._id}</span>
                  <span className="text-xs opacity-70">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {filterOptions.colors.length > 0 && (
          <div className="pb-6 border-b border-red-200 dark:border-red-900">
            <label className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 font-bold mb-3 block">
              Colors
            </label>
            <div className="grid grid-cols-4 gap-2">
              {filterOptions.colors.map(color => (
                <button
                  key={color._id}
                  onClick={() => handleFilterChange('color', filters.color === color._id ? '' : color._id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    filters.color === color._id 
                      ? 'bg-red-500' 
                      : 'bg-white dark:bg-black border border-red-200 dark:border-red-900 hover:border-red-500'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-red-500  shadow-md"
                    style={{ backgroundColor: color.colorCode || '#ccc' }}
                  />
                  <span className="text-xs capitalize text-black dark:text-white">{color._id}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {filterOptions.brands.length > 0 && (
          <div>
            <label className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 font-bold mb-3 block">
              Brands
            </label>
            <div className="space-y-2">
              {filterOptions.brands.map(brand => (
                <label key={brand._id} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-black dark:text-white">{brand._id}</span>
                  <input
                    type="checkbox"
                    checked={filters.brand === brand._id}
                    onChange={() => handleFilterChange('brand', filters.brand === brand._id ? '' : brand._id)}
                    className="w-4 h-4 rounded border-red-300 text-red-500 focus:ring-red-500"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply button for mobile */}
      {isMobile && (
        <div className="p-5 border-t border-red-200 dark:border-red-900">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
        <Loader className="w-12 h-12 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-rose-100 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
      <main className="pt-20 md:pt-24 pb-20 px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-4 text-black dark:text-white">
            THE <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] italic">COLLECTION</span>
          </h1>
          <p className="text-black/70 dark:text-white/70 text-base md:text-lg max-w-md mx-auto">
            Precision engineering meets raw electric power. Explore our curated range of signature instruments.
          </p>
        </div>

        <div className="flex gap-6 relative">
          {/* Desktop Filter Sidebar */}
          {!isMobile && isFilterOpen && (
            <aside className="w-80 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl border border-red-200 dark:border-red-900 overflow-hidden">
                <FilterSidebar />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full border border-red-200 dark:border-red-900"
              >
                <Filter size={18} className="text-red-500" />
                <span className="text-sm text-black dark:text-white">
                  {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-black/60 dark:text-white/60">Sort by:</span>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-red-200 dark:border-red-900 rounded-full px-4 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="popular">Customer Favorites</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full text-sm text-black dark:text-white border border-red-200 dark:border-red-900">
                    {filters.category}
                    <button onClick={() => handleFilterChange('category', '')} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full text-sm text-black dark:text-white border border-red-200 dark:border-red-900">
                    {filters.brand}
                    <button onClick={() => handleFilterChange('brand', '')} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.color && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full text-sm text-black dark:text-white border border-red-200 dark:border-red-900">
                    {filters.color}
                    <button onClick={() => handleFilterChange('color', '')} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.isFeatured && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full text-sm text-black dark:text-white border border-red-200 dark:border-red-900">
                    <Sparkles size={12} className="text-red-500" />
                    Featured
                    <button onClick={() => handleFilterChange('isFeatured', false)} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full text-sm text-black dark:text-white border border-red-200 dark:border-red-900">
                    ₹{filters.minPrice || 0} - ₹{filters.maxPrice || filterOptions.priceRange.max}
                    <button onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-500/30 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            <div className="text-sm text-black/60 dark:text-white/60 mb-4">
              Showing <span className="text-black dark:text-white font-bold">{products.length}</span> of <span className="text-black dark:text-white font-bold">{pagination.totalProducts}</span> instruments
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={fetchProducts} className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-black/60 dark:text-white/60 text-lg">No products found</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <ShopProductCard key={product._id} product={product} index={index} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="w-10 h-10 rounded-full border border-red-200 dark:border-red-900 flex items-center justify-center text-black dark:text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-full transition-all font-bold ${
                        pagination.currentPage === pageNum
                          ? 'bg-red-500 text-white'
                          : 'border border-red-200 dark:border-red-900 hover:bg-red-500 hover:text-white text-black dark:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                  <>
                    <span className="px-2 text-black/60 dark:text-white/60">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="w-10 h-10 rounded-full border border-red-200 dark:border-red-900 hover:bg-red-500 hover:text-white text-black dark:text-white transition-all font-bold"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="w-10 h-10 rounded-full border border-red-200 dark:border-red-900 flex items-center justify-center text-black dark:text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isMobile && isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-14 inset-0 z-50"
          >
            <div className="absolute   backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-full max-w-65 bg-white dark:bg-black shadow-2xl overflow-y-auto"
            >
              <FilterSidebar onClose={() => setIsFilterOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;