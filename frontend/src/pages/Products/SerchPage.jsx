import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ArrowUpDown, ChevronDown, Star, Heart, TrendingUp, Clock, Zap, Sparkles } from 'lucide-react';
import { useGetProductsQuery } from '../../utils/productApi';
import ShopProductCard from '../../components/Products/ShopProductCard';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom Toggle Switch Component
const ToggleSwitch = ({ label, icon: Icon, checked, onChange, color = 'red' }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className={`text-${color}-500`} />}
        <span className="text-sm font-medium text-black dark:text-white">{label}</span>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${
          checked ? `bg-${color}-500` : 'bg-gray-300 dark:bg-gray-700'
        }`}>
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
            checked ? `translate-x-5` : 'translate-x-0'
          }`} />
        </div>
      </div>
    </label>
  );
};

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
    featured: false,
    mostLoved: false,
    mostSearched: false,
    bestSeller: false,
    onSale: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);

  // Use custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only trigger search when there's a search term
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
      setShouldSearch(true);
    } else {
      setShouldSearch(false);
    }
  }, [debouncedSearchTerm]);

  // Process search term for fuzzy matching - add partial search capability
  const processedSearchTerm = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim().length === 0) {
      return '';
    }
    // This will help with partial matching like "aco" matching "acoustic"
    return debouncedSearchTerm.trim();
  }, [debouncedSearchTerm]);

  // Build query params - only include search if we should search
  const queryParams = useMemo(() => {
    const params = {};
    
    // Only add search param if we have a search term and should search
    if (shouldSearch && processedSearchTerm) {
      params.search = processedSearchTerm;
    }
    
    if (sortBy && shouldSearch) params.sortBy = sortBy;
    if (filters.minPrice && shouldSearch) params.minPrice = filters.minPrice;
    if (filters.maxPrice && shouldSearch) params.maxPrice = filters.maxPrice;
    if (filters.inStock && shouldSearch) params.inStock = true;
    if (filters.featured && shouldSearch) params.isFeatured = true;
    if (filters.mostLoved && shouldSearch) params.mostLoved = true;
    if (filters.mostSearched && shouldSearch) params.mostSearched = true;
    if (filters.bestSeller && shouldSearch) params.bestSeller = true;
    if (filters.onSale && shouldSearch) params.onSale = true;
    
    return params;
  }, [shouldSearch, processedSearchTerm, sortBy, filters]);

  // Only call the API when shouldSearch is true
  const { data, isLoading, isError, refetch } = useGetProductsQuery(queryParams, {
    skip: !shouldSearch, // Skip the query when there's no search term
  });
  
  const products = data?.data?.products || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShouldSearch(false);
  };

  const handleFilterChange = (key, value) => {
    if (shouldSearch) {
      setFilters(prev => ({ ...prev, [key]: value }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      inStock: false,
      featured: false,
      mostLoved: false,
      mostSearched: false,
      bestSeller: false,
      onSale: false
    });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'priceLow', label: 'Price: Low to High', icon: ArrowUpDown },
    { value: 'priceHigh', label: 'Price: High to Low', icon: ArrowUpDown },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'rating', label: 'Top Rated', icon: Star }
  ];

  const getSortIcon = (option) => {
    const Icon = option.icon;
    return <Icon size={16} />;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.inStock) count++;
    if (filters.featured) count++;
    if (filters.mostLoved) count++;
    if (filters.mostSearched) count++;
    if (filters.bestSeller) count++;
    if (filters.onSale) count++;
    return count;
  };

  // Mobile filter sidebar
  const MobileFilterSidebar = () => {
    if (!showFilters) return null;
    
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-black border-r border-red-200 dark:border-red-800 p-6 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-black dark:text-white">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <FilterContent />
        </motion.div>
      </div>
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-black dark:text-white mb-3">
          Price Range
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:border-red-500 text-black dark:text-white placeholder-gray-400"
              disabled={!shouldSearch}
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:border-red-500 text-black dark:text-white placeholder-gray-400"
              disabled={!shouldSearch}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-red-200 dark:bg-red-800" />

      {/* Quick Filters with Toggle Switches */}
      <div>
        <label className="block text-sm font-semibold text-black dark:text-white mb-3">
          Quick Filters
        </label>
        <div className="space-y-3">
          <ToggleSwitch
            label="In Stock Only"
            icon={null}
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            color="green"
          />
          <ToggleSwitch
            label="Featured Products"
            icon={Star}
            checked={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.checked)}
            color="yellow"
          />
          <ToggleSwitch
            label="Most Loved"
            icon={Heart}
            checked={filters.mostLoved}
            onChange={(e) => handleFilterChange('mostLoved', e.target.checked)}
            color="pink"
          />
          <ToggleSwitch
            label="Most Searched"
            icon={TrendingUp}
            checked={filters.mostSearched}
            onChange={(e) => handleFilterChange('mostSearched', e.target.checked)}
            color="blue"
          />
          <ToggleSwitch
            label="Best Sellers"
            icon={Zap}
            checked={filters.bestSeller}
            onChange={(e) => handleFilterChange('bestSeller', e.target.checked)}
            color="orange"
          />
          <ToggleSwitch
            label="On Sale"
            icon={Sparkles}
            checked={filters.onSale}
            onChange={(e) => handleFilterChange('onSale', e.target.checked)}
            color="red"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-red-500 hover:text-red-600 text-sm font-medium border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          disabled={!shouldSearch}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  // Initial State - No Search Performed
  if (!shouldSearch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black">
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* PNG Image Placeholder */}
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950 dark:to-red-900 rounded-full mb-6 shadow-2xl">
                <span className="text-6xl">🎵</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-4"
            >
              Search Your Favourite Instruments
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Discover the perfect instrument to bring your music to life
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative max-w-2xl mx-auto transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center bg-white dark:bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 overflow-hidden">
                  <Search className="absolute left-4 text-red-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search for guitars, pianos, drums, accessories..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-black dark:text-white placeholder-gray-400 focus:outline-none text-base md:text-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-4 p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                    >
                      <X size={18} className="text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Popular Searches Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Guitar', 'Piano', 'Drums', 'Violin', 'Saxophone', 'Acoustic Guitar'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setShouldSearch(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Search Results View
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-red-200 dark:border-red-800 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search for instruments..."
                  className="w-full pl-10 pr-10 py-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl focus:outline-none focus:border-red-500 text-black dark:text-white"
                />
                {searchTerm && (
                  <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={16} className="text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setShouldSearch(false)}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-red-200 dark:border-red-900">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Filter size={18} />
              <span className="font-medium">Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-red-500 text-xs rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Active Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active:</span>
                {filters.minPrice && (
                  <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full">
                    Min: ₹{filters.minPrice}
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full">
                    Max: ₹{filters.maxPrice}
                  </span>
                )}
                {filters.inStock && (
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-950 text-green-600 rounded-full">
                    In Stock
                  </span>
                )}
                {filters.featured && (
                  <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-600 rounded-full">
                    Featured
                  </span>
                )}
                {filters.mostLoved && (
                  <span className="text-xs px-2 py-1 bg-pink-100 dark:bg-pink-950 text-pink-600 rounded-full">
                    Most Loved
                  </span>
                )}
                {filters.mostSearched && (
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-full">
                    Most Searched
                  </span>
                )}
                {filters.bestSeller && (
                  <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-full">
                    Best Seller
                  </span>
                )}
                {filters.onSale && (
                  <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-950 text-red-600 rounded-full">
                    On Sale
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 ml-2">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-black/50 border border-red-200 dark:border-red-800 rounded-xl hover:border-red-500 transition-all duration-300"
            >
              <ArrowUpDown size={16} />
              <span className="font-medium">
                Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-xl shadow-2xl z-20 overflow-hidden"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-950 transition-colors ${
                        sortBy === option.value ? 'text-red-500 bg-red-50 dark:bg-red-950' : 'text-black dark:text-white'
                      }`}
                    >
                      {getSortIcon(option)}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Filters Panel */}
        {!isMobile && (
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white dark:bg-black/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <FilterContent />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Mobile Filter Sidebar */}
        <MobileFilterSidebar />

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm md:text-base text-black dark:text-white/70">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                Searching...
              </span>
            ) : products.length === 0 && !isLoading ? (
              'No products found'
            ) : (
              `Found ${products.length} products`
            )}
            {searchTerm && !isLoading && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-64 md:h-80 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 md:py-20"
          >
            <div className="text-6xl md:text-7xl mb-4">🔍</div>
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2">No instruments found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 px-4">
              We couldn't find any products matching "{searchTerm}".
              Try searching with different keywords.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setShouldSearch(false);
                clearFilters();
              }}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-medium"
            >
              Start New Search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ShopProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;