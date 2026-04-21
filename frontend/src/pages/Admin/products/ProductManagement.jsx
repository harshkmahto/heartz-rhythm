// ProductManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, TrendingUp, ShoppingBag, DollarSign, 
  Clock, Star, Eye, ChevronLeft, ChevronRight,
  Calendar, AlertCircle, Zap, Layers, Gift, Rocket,
  RefreshCw, Truck, CheckCircle, XCircle, BarChart3, PieChart
} from 'lucide-react';
import { getAllProducts } from '../../../utils/product.apiRequest';
import AdminProductCard from '../../../components/Admin/products/AdminProductCard';
import Loader from '../../../components/ShowCaseSection/Loader';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    scheduledProducts: 0,
    featuredProducts: 0,
    totalStock: 0,
    totalSold: 0
  });
  
  const [allProducts, setAllProducts] = useState([]);
  const [comingSoonProducts, setComingSoonProducts] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [scheduledProducts, setScheduledProducts] = useState([]);
  const [draftProducts, setDraftProducts] = useState([]);
  const [returnAvailableProducts, setReturnAvailableProducts] = useState([]);
  const [replacementAvailableProducts, setReplacementAvailableProducts] = useState([]);
  
  // Date wise product creation stats
  const [productCreationStats, setProductCreationStats] = useState([]);
  const [mostProductiveDay, setMostProductiveDay] = useState(null);
  
  // Refs for scrollable containers
  const comingSoonRef = useRef(null);
  const activeRef = useRef(null);
  const featuredRef = useRef(null);
  const scheduledRef = useRef(null);
  const draftRef = useRef(null);
  const returnRef = useRef(null);
  const replacementRef = useRef(null);
  
  const [showLeftArrow, setShowLeftArrow] = useState({});
  const [showRightArrow, setShowRightArrow] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all products directly without statistics endpoint
      const productsResponse = await getAllProducts();
      
      if (productsResponse.success && productsResponse.data) {
        const products = productsResponse.data.products || [];
        setAllProducts(products);
        
        // Calculate statistics from products data
        const activeCount = products.filter(p => p.status === 'active' && !p.isComingSoon).length;
        const draftCount = products.filter(p => p.status === 'draft').length;
        const scheduledCount = products.filter(p => p.status === 'scheduled').length;
        const featuredCount = products.filter(p => p.isFeatured === true).length;
        const totalStockSum = products.reduce((sum, p) => sum + (p.totalStock || 0), 0);
        const totalSoldSum = products.reduce((sum, p) => sum + (p.totalSold || 0), 0);
        
        setStats({
          totalProducts: products.length,
          activeProducts: activeCount,
          draftProducts: draftCount,
          scheduledProducts: scheduledCount,
          featuredProducts: featuredCount,
          totalStock: totalStockSum,
          totalSold: totalSoldSum
        });
        
        // Filter products by status
        setComingSoonProducts(products.filter(p => p.isComingSoon === true));
        setActiveProducts(products.filter(p => p.status === 'active' && !p.isComingSoon));
        setFeaturedProducts(products.filter(p => p.isFeatured === true));
        setScheduledProducts(products.filter(p => p.status === 'scheduled'));
        setDraftProducts(products.filter(p => p.status === 'draft'));
        
        // Filter by return and replacement availability
        setReturnAvailableProducts(products.filter(p => p.return?.isAvailable === true));
        setReplacementAvailableProducts(products.filter(p => p.replacement?.isAvailable === true));
        
        // Calculate product creation statistics by date
        calculateProductCreationStats(products);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const calculateProductCreationStats = (products) => {
    const dateMap = new Map();
    
    products.forEach(product => {
      if (product.createdAt) {
        const date = new Date(product.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      }
    });
    
    const sortedStats = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    setProductCreationStats(sortedStats);
    
    if (sortedStats.length > 0) {
      const mostProductive = sortedStats.reduce((max, item) => 
        item.count > max.count ? item : max, sortedStats[0]);
      setMostProductiveDay(mostProductive);
    }
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScrollButtons = (ref, sectionKey) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setShowLeftArrow(prev => ({ ...prev, [sectionKey]: scrollLeft > 0 }));
      setShowRightArrow(prev => ({ ...prev, [sectionKey]: scrollLeft + clientWidth < scrollWidth - 10 }));
    }
  };

  useEffect(() => {
    const sections = ['comingSoon', 'active', 'featured', 'scheduled', 'draft', 'return', 'replacement'];
    const refs = {
      comingSoon: comingSoonRef,
      active: activeRef,
      featured: featuredRef,
      scheduled: scheduledRef,
      draft: draftRef,
      return: returnRef,
      replacement: replacementRef
    };
    
    const timeoutIds = {};
    
    sections.forEach(section => {
      const ref = refs[section];
      if (ref.current) {
        timeoutIds[section] = setTimeout(() => {
          checkScrollButtons(ref, section);
        }, 100);
        ref.current.addEventListener('scroll', () => checkScrollButtons(ref, section));
      }
    });
    
    return () => {
      sections.forEach(section => {
        const ref = refs[section];
        if (ref.current) {
          ref.current.removeEventListener('scroll', () => checkScrollButtons(ref, section));
          if (timeoutIds[section]) clearTimeout(timeoutIds[section]);
        }
      });
    };
  }, [allProducts]);

  const SectionCard = ({ title, icon: Icon, products, refProp, sectionKey, badgeColor = 'red', emptyMessage = 'No products found' }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`text-${badgeColor}-600`} size={24} />
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100">{title}</h2>
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
            {products.length}
          </span>
        </div>
        {products.length > 0 && (
          <div className="flex gap-2">
            {showLeftArrow[sectionKey] && (
              <button
                onClick={() => scroll(refProp, 'left')}
                className="p-2 bg-white dark:bg-black/60 rounded-full shadow-md border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
              >
                <ChevronLeft size={20} className="text-red-600" />
              </button>
            )}
            {showRightArrow[sectionKey] && (
              <button
                onClick={() => scroll(refProp, 'right')}
                className="p-2 bg-white dark:bg-black/60 rounded-full shadow-md border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
              >
                <ChevronRight size={20} className="text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-8 text-center border border-red-200 dark:border-red-800">
          <Package className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-500 dark:text-red-400">{emptyMessage}</p>
        </div>
      ) : (
        <div
          ref={refProp}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
        >
          {products.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-72">
              <AdminProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Calculate pie chart percentages
  const total = stats.activeProducts + stats.draftProducts + stats.scheduledProducts;
  const activePercent = total > 0 ? (stats.activeProducts / total) * 100 : 0;
  const draftPercent = total > 0 ? (stats.draftProducts / total) * 100 : 0;
  const scheduledPercent = total > 0 ? (stats.scheduledProducts / total) * 100 : 0;

  // Calculate circumference for pie chart
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const activeDash = (activePercent / 100) * circumference;
  const draftDash = (draftPercent / 100) * circumference;
  const scheduledDash = (scheduledPercent / 100) * circumference;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <Loader/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Data</h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold mx-auto cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-100 border-l-4 border-red-600 pl-4">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">
            Manage and monitor all products across the platform
          </p>
        </div>

        {/* Statistics Cards - Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
            <div className="flex items-center justify-between">
              <Package className="text-red-500" size={20} />
              <span className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.totalProducts}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Products</p>
          </div>
          
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-green-500 shadow-sm">
            <div className="flex items-center justify-between">
              <Zap className="text-green-500" size={20} />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeProducts}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active</p>
          </div>
          
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-yellow-500 shadow-sm">
            <div className="flex items-center justify-between">
              <Clock className="text-yellow-500" size={20} />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draftProducts}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Draft</p>
          </div>
          
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <Calendar className="text-blue-500" size={20} />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.scheduledProducts}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scheduled</p>
          </div>
          
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-purple-500 shadow-sm">
            <div className="flex items-center justify-between">
              <Star className="text-purple-500" size={20} />
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.featuredProducts}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Featured</p>
          </div>
          
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-orange-500 shadow-sm">
            <div className="flex items-center justify-between">
              <ShoppingBag className="text-orange-500" size={20} />
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalStock?.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Stock</p>
          </div>
          
          <div className="bg-white dark:bg-black/80 rounded-xl p-4 border-l-4 border-teal-500 shadow-sm">
            <div className="flex items-center justify-between">
              <TrendingUp className="text-teal-500" size={20} />
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.totalSold?.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Sold</p>
          </div>
        </div>

        {/* Charts Section - Pie Chart & Bar Chart */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Pie Chart - Product Status Distribution */}
          <div className="bg-white dark:bg-black/80 rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="text-red-600" size={22} />
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Product Status Distribution</h3>
            </div>
            
            <div className="flex flex-col items-center">
              {/* Donut/Pie Chart Visualization */}
              <div className="relative w-48 h-48 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                    className="dark:stroke-gray-700"
                  />
                  {/* Active Products */}
                  {activePercent > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeDasharray={`${activeDash} ${circumference}`}
                      strokeDashoffset="0"
                      className="transition-all duration-500"
                    />
                  )}
                  {/* Draft Products */}
                  {draftPercent > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="20"
                      strokeDasharray={`${draftDash} ${circumference}`}
                      strokeDashoffset={-activeDash}
                      className="transition-all duration-500"
                    />
                  )}
                  {/* Scheduled Products */}
                  {scheduledPercent > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray={`${scheduledDash} ${circumference}`}
                      strokeDashoffset={-(activeDash + draftDash)}
                      className="transition-all duration-500"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-red-700 dark:text-red-300">{total}</span>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active ({stats.activeProducts})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Draft ({stats.draftProducts})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Scheduled ({stats.scheduledProducts})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart - Product Creation Stats */}
          <div className="bg-white dark:bg-black/80 rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-red-600" size={22} />
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Product Creation Trend</h3>
            </div>
            
            {productCreationStats.length > 0 ? (
              <div>
                {/* Most Productive Day Highlight */}
                {mostProductiveDay && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <span className="font-semibold">🔥 Most Productive Day:</span> {mostProductiveDay.date} 
                      <span className="ml-2 font-bold text-red-600">{mostProductiveDay.count} products</span>
                    </p>
                  </div>
                )}
                
                {/* Bar Chart Bars */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {productCreationStats.map((item, idx) => {
                    const maxCount = Math.max(...productCreationStats.map(i => i.count));
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-28 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
                          {item.date}
                        </div>
                        <div className="flex-1">
                          <div className="h-8 bg-red-100 dark:bg-red-900/30 rounded-lg overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-end pr-2 text-xs text-white font-medium"
                              style={{ width: `${percentage}%` }}
                            >
                              {percentage > 15 && item.count}
                            </div>
                          </div>
                        </div>
                        <div className="w-8 text-sm font-semibold text-red-700 dark:text-red-400">
                          {item.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-red-300 mx-auto mb-2" />
                <p className="text-gray-500">No product creation data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Products Section */}
        <SectionCard
          title="Coming Soon"
          icon={Rocket}
          products={comingSoonProducts}
          refProp={comingSoonRef}
          sectionKey="comingSoon"
          badgeColor="orange"
          emptyMessage="No products marked as Coming Soon"
        />

        {/* Active Products Section */}
        <SectionCard
          title="Active Products"
          icon={Zap}
          products={activeProducts}
          refProp={activeRef}
          sectionKey="active"
          badgeColor="green"
          emptyMessage="No active products available"
        />

        {/* Featured Products Section */}
        <SectionCard
          title="Featured Products"
          icon={Star}
          products={featuredProducts}
          refProp={featuredRef}
          sectionKey="featured"
          badgeColor="purple"
          emptyMessage="No featured products"
        />

        {/* Scheduled Products Section */}
        <SectionCard
          title="Scheduled Products"
          icon={Calendar}
          products={scheduledProducts}
          refProp={scheduledRef}
          sectionKey="scheduled"
          badgeColor="blue"
          emptyMessage="No scheduled products"
        />

        {/* Draft Products Section */}
        <SectionCard
          title="Draft Products"
          icon={Layers}
          products={draftProducts}
          refProp={draftRef}
          sectionKey="draft"
          badgeColor="yellow"
          emptyMessage="No draft products"
        />

        {/* Return Available Products Section */}
        <SectionCard
          title="Return Available"
          icon={RefreshCw}
          products={returnAvailableProducts}
          refProp={returnRef}
          sectionKey="return"
          badgeColor="teal"
          emptyMessage="No products with return policy"
        />

        {/* Replacement Available Products Section */}
        <SectionCard
          title="Replacement Available"
          icon={Truck}
          products={replacementAvailableProducts}
          refProp={replacementRef}
          sectionKey="replacement"
          badgeColor="indigo"
          emptyMessage="No products with replacement policy"
        />

        {/* View All Products Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/admin/products/all')}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;