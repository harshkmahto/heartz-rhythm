import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronRight,
  PieChart,
  BarChart3,
  Wallet,
  Users,
  Building2,
  Truck,
  Percent,
  Tag,
  Eye
} from 'lucide-react';
import { getAdminRevenue } from '../../../utils/order.apiRequest';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminRevenue = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await getAdminRevenue();
      if (response.success) {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const CountUpAnimation = ({ target, prefix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const step = (target / duration) * 10;
      
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 10);
      
      return () => clearInterval(timer);
    }, [target]);

    return <span>{prefix}{count.toLocaleString()}</span>;
  };

  const StatCard = ({ icon: Icon, title, value, prefix = '', subtext, trend }) => (
    <div className="bg-white dark:bg-black rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg hover:shadow-red-100 dark:hover:shadow-red-900/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-red-600' : 'text-red-500'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-black/60 dark:text-white/60 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-black dark:text-white">
        <CountUpAnimation target={value} prefix={prefix} />
      </p>
      {subtext && <p className="text-xs text-black/50 dark:text-white/50 mt-2">{subtext}</p>}
    </div>
  );

  const getMonthlyChartData = () => {
    if (!revenueData?.items) return null;
    
    const monthlyRevenue = {};
    revenueData.items.forEach(item => {
      const date = new Date(item.orderDate);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + item.adminRevenue;
    });

    const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    return {
      labels: sortedMonths,
      datasets: [{
        data: sortedMonths.map(month => monthlyRevenue[month]),
        backgroundColor: ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5', '#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5'],
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    };
  };

  const getWeeklyData = () => {
    if (!revenueData?.items) return [];
    
    const weeklyRevenue = {};
    revenueData.items.forEach(item => {
      const date = new Date(item.orderDate);
      const weekNumber = Math.ceil(date.getDate() / 7);
      const week = `${date.toLocaleString('default', { month: 'short' })} Week ${weekNumber}`;
      weeklyRevenue[week] = (weeklyRevenue[week] || 0) + item.adminRevenue;
    });

    return Object.entries(weeklyRevenue)
      .map(([week, revenue]) => ({ week, revenue }))
      .slice(-6);
  };

  const getSellerChartData = () => {
    if (!revenueData?.sellerBreakdown) return null;
    
    const topSellers = revenueData.sellerBreakdown.slice(0, 5);
    return {
      labels: topSellers.map(s => s.sellerName),
      datasets: [{
        data: topSellers.map(s => s.totalAdminRevenue),
        backgroundColor: ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5'],
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-black dark:to-red-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-black dark:text-white text-lg">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  const monthlyChartData = getMonthlyChartData();
  const weeklyData = getWeeklyData();
  const sellerChartData = getSellerChartData();
  const summary = revenueData?.summary || { 
    totalAdminRevenue: 0, 
    totalSellerRevenue: 0, 
    totalOrders: 0, 
    totalItems: 0,
    totalPlatformFee: 0,
    totalShippingCharge: 0
  };

  // Filter items based on selected seller
  const filteredItems = revenueData?.items?.filter(item => 
    selectedSeller === 'all' || item.seller?._id === selectedSeller
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-black dark:to-red-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-4">
            Admin Revenue Dashboard
          </h1>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 px-6 py-3 rounded-full">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-black dark:text-white text-sm">
              Platform revenue = Total amount - Seller payout • Analytics refresh daily
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Building2}
            title="Platform Revenue"
            value={summary.totalAdminRevenue}
            prefix="₹"
            subtext={`${((summary.totalAdminRevenue / (summary.totalAdminRevenue + summary.totalSellerRevenue)) * 100).toFixed(1)}% of total`}
          />
          <StatCard
            icon={Wallet}
            title="Seller Payouts"
            value={summary.totalSellerRevenue}
            prefix="₹"
            subtext={`${((summary.totalSellerRevenue / (summary.totalAdminRevenue + summary.totalSellerRevenue)) * 100).toFixed(1)}% of total`}
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={summary.totalOrders}
            subtext={`${summary.totalItems} items sold`}
          />
          <StatCard
            icon={DollarSign}
            title="Total Value"
            value={summary.totalAdminRevenue + summary.totalSellerRevenue}
            prefix="₹"
            subtext={`Platform fee: ₹${summary.totalPlatformFee.toLocaleString()}`}
          />
        </div>

        {/* Revenue Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Platform Revenue</h3>
              <Building2 className="w-8 h-8 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalAdminRevenue)}</p>
            <p className="text-white/80 text-sm mt-2">Admin commission & fees</p>
          </div>
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 shadow-lg dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Seller Payouts</h3>
              <Wallet className="w-8 h-8 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalSellerRevenue)}</p>
            <p className="text-white/80 text-sm mt-2">Paid to sellers</p>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Platform Fees</h3>
              <Percent className="w-8 h-8 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalPlatformFee)}</p>
            <p className="text-white/80 text-sm mt-2">+ ₹{summary.totalShippingCharge.toLocaleString()} shipping</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Pie Chart */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Monthly Platform Revenue</h2>
              <PieChart className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            {monthlyChartData ? (
              <div className="h-80">
                <Pie 
                  data={monthlyChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: 'bottom', 
                        labels: { 
                          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' 
                        } 
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `₹${ctx.raw.toLocaleString()}`
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-black/60 dark:text-white/60">No data available</p>
              </div>
            )}
          </div>

          {/* Weekly Revenue Bar Chart */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Weekly Revenue Trend</h2>
              <BarChart3 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            {weeklyData.length > 0 ? (
              <div className="h-80">
                <Bar
                  data={{
                    labels: weeklyData.map(w => w.week),
                    datasets: [{
                      label: 'Platform Revenue (₹)',
                      data: weeklyData.map(w => w.revenue),
                      backgroundColor: '#ef4444',
                      borderRadius: 8,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: { 
                        callbacks: { 
                          label: (ctx) => `₹${ctx.raw.toLocaleString()}` 
                        } 
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => `₹${value.toLocaleString()}`
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-black/60 dark:text-white/60">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Sellers Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Top Sellers by Platform Revenue</h2>
              <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            {sellerChartData ? (
              <div className="h-80">
                <Pie 
                  data={sellerChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: 'bottom', 
                        labels: { 
                          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' 
                        } 
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `${ctx.label}: ₹${ctx.raw.toLocaleString()}`
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-black/60 dark:text-white/60">No seller data available</p>
              </div>
            )}
          </div>

          {/* Seller Breakdown List */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6">Seller Revenue Breakdown</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {revenueData?.sellerBreakdown?.map((seller, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-xl hover:shadow-md transition-all">
                  <div className="flex-1">
                    <p className="font-semibold text-black dark:text-white">{seller.sellerName}</p>
                    <p className="text-xs text-black/60 dark:text-white/60">{seller.totalOrders} orders • {seller.totalItems} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600 dark:text-red-400">Platform: ₹{seller.totalAdminRevenue.toLocaleString()}</p>
                    <p className="text-xs text-black/60 dark:text-white/60">Payout: ₹{seller.totalSellerRevenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {(!revenueData?.sellerBreakdown || revenueData.sellerBreakdown.length === 0) && (
                <p className="text-center text-black/60 dark:text-white/60 py-8">No seller data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Items List with Expandable Rows */}
        <div className="bg-white dark:bg-black rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-black dark:text-white">Revenue Breakdown by Item</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl flex gap-4 flex-wrap">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-black border border-red-300 dark:border-red-700 rounded-lg text-black dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <select 
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-black border border-red-300 dark:border-red-700 rounded-lg text-black dark:text-white"
              >
                <option value="all">All Sellers</option>
                {revenueData?.sellerBreakdown?.map((seller, idx) => (
                  <option key={idx} value={seller.sellerId}>{seller.sellerName}</option>
                ))}
              </select>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-red-200 dark:border-red-800">
                <tr className="text-left text-black/70 dark:text-white/70">
                  <th className="pb-3 w-10"></th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Seller</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Seller Revenue</th>
                  <th className="pb-3">Platform Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.slice(0, 20).map((item, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="border-b border-red-100 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer" onClick={() => toggleExpand(item.itemId)}>
                      <td className="py-4">
                        {expandedItems.has(item.itemId) ? 
                          <ChevronDown className="w-4 h-4 text-red-500" /> : 
                          <ChevronRight className="w-4 h-4 text-red-500" />
                        }
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.product.thumbnail || 'https://via.placeholder.com/48'} 
                            alt={item.product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                          />
                          <div>
                            <p className="font-medium text-black dark:text-white">{item.product.title}</p>
                            <p className="text-sm text-black/60 dark:text-white/60">{item.product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-black dark:text-white">{item.seller?.name}</p>
                      </td>
                      <td className="py-4 text-black dark:text-white">{item.quantity}</td>
                      <td className="py-4 font-semibold text-black dark:text-white">
                        ₹{((item.pricing?.sellingPrice || 0) * item.quantity).toLocaleString()}
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-400">
                        ₹{item.sellerRevenue?.toLocaleString() || 0}
                      </td>
                      <td className="py-4 font-bold text-red-600 dark:text-red-400">
                        ₹{item.adminRevenue?.toLocaleString() || 0}
                      </td>
                    </tr>
                    {expandedItems.has(item.itemId) && (
                      <tr className="bg-red-50/50 dark:bg-red-950/10">
                        <td colSpan="7" className="py-4 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Details */}
                            <div>
                              <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4 text-red-500" />
                                Product Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-black/60 dark:text-white/60">Category:</span> {item.product.category}</p>
                                <p><span className="text-black/60 dark:text-white/60">Sub Category:</span> {item.product.subCategory}</p>
                                <p><span className="text-black/60 dark:text-white/60">Brand:</span> {item.product.brand}</p>
                                <p><span className="text-black/60 dark:text-white/60">Color:</span> {item.variant?.colorName || 'N/A'}</p>
                                <p><span className="text-black/60 dark:text-white/60">Size/Variant:</span> {item.variant?.size || 'Standard'}</p>
                              </div>
                            </div>
                            
                            {/* Pricing Breakdown */}
                            <div>
                              <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-red-500" />
                                Pricing Breakdown
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-black/60 dark:text-white/60">MRP:</span>
                                  <span className="line-through text-black/50">₹{item.pricing?.mrp?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-black/60 dark:text-white/60">Base Price:</span>
                                  <span className="font-medium">₹{item.pricing?.basePrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-black/60 dark:text-white/60">Final Price:</span>
                                  <span>₹{item.pricing?.finalPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-black/60 dark:text-white/60">Selling Price:</span>
                                  <span>₹{item.pricing?.sellingPrice?.toLocaleString()}</span>
                                </div>
                                {item.pricing?.totalDiscount > 0 && (
                                  <div className="flex justify-between text-red-500">
                                    <span>Discount Applied:</span>
                                    <span>-₹{item.pricing?.totalDiscount?.toLocaleString()} ({item.pricing?.discountPercentage}%)</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-black/60 dark:text-white/60">Platform Fee:</span>
                                  <span>₹{item.platformFee?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-black/60 dark:text-white/60">Shipping Charge:</span>
                                  <span>₹{item.shippingCharge?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-red-200 dark:border-red-800">
                                  <span className="font-semibold">Total Paid by Customer:</span>
                                  <span className="font-bold">₹{((item.pricing?.sellingPrice || 0) * item.quantity).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Revenue Split */}
                            <div className="md:col-span-2">
                              <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-red-500" />
                                Revenue Split
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                  <p className="text-xs text-black/60 dark:text-white/60">Seller Revenue</p>
                                  <p className="text-lg font-bold text-gray-700 dark:text-gray-300">₹{item.sellerRevenue?.toLocaleString()}</p>
                                  <p className="text-xs text-black/50 dark:text-white/50">Base Price × Quantity - Discount</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                                  <p className="text-xs text-black/60 dark:text-white/60">Platform Revenue</p>
                                  <p className="text-lg font-bold text-red-600 dark:text-red-400">₹{item.adminRevenue?.toLocaleString()}</p>
                                  <p className="text-xs text-black/50 dark:text-white/50">Total Amount - Seller Revenue</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Info */}
                            <div className="md:col-span-2">
                              <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-500" />
                                Order Information
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-black/60 dark:text-white/60">Order ID</p>
                                  <p className="font-mono text-xs">{item.orderId}</p>
                                </div>
                                <div>
                                  <p className="text-black/60 dark:text-white/60">Order Date</p>
                                  <p>{new Date(item.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-black/60 dark:text-white/60">Payment Type</p>
                                  <p className="capitalize">{item.paymentType}</p>
                                </div>
                                <div>
                                  <p className="text-black/60 dark:text-white/60">Payment Status</p>
                                  <p className={`capitalize ${item.paymentStatus === 'success' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {item.paymentStatus}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-black/60 dark:text-white/60">No revenue data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRevenue;