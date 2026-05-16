import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertCircle,
  Download,
  Filter,
  ChevronDown,
  PieChart,
  BarChart3,
  Wallet,
  Clock
} from 'lucide-react';
import { getSellerRevenue } from '../../../utils/order.apiRequest';
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

const SellerRevenue = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await getSellerRevenue();
      if (response.success) {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const CountUpAnimation = ({ target, suffix = '', prefix = '' }) => {
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

    return <span>{prefix}{count}{suffix}</span>;
  };

  const StatCard = ({ icon: Icon, title, value, suffix = '', prefix = '', subtext, trend }) => (
    <div className="bg-white dark:bg-black rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg hover:shadow-green-100 dark:hover:shadow-green-900/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-black/60 dark:text-white/60 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-black dark:text-white">
        <CountUpAnimation target={value} prefix={prefix} suffix={suffix} />
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
      monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + item.sellerRevenue;
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
        backgroundColor: [
          '#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac',
          '#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    };
  };

  const getTopProductsData = () => {
    if (!revenueData?.items) return [];
    
    const productRevenue = {};
    revenueData.items.forEach(item => {
      const key = item.product.title;
      if (!productRevenue[key]) {
        productRevenue[key] = {
          title: item.product.title,
          thumbnail: item.product.thumbnail,
          revenue: 0,
          quantity: 0
        };
      }
      productRevenue[key].revenue += item.sellerRevenue;
      productRevenue[key].quantity += item.quantity;
    });

    return Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getWeeklyData = () => {
    if (!revenueData?.items) return [];
    
    const weeklyRevenue = {};
    revenueData.items.forEach(item => {
      const date = new Date(item.orderDate);
      const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      weeklyRevenue[week] = (weeklyRevenue[week] || 0) + item.sellerRevenue;
    });

    return Object.entries(weeklyRevenue)
      .map(([week, revenue]) => ({ week, revenue }))
      .slice(-7);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-black dark:to-green-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-black dark:text-white text-lg">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  const topProducts = getTopProductsData();
  const monthlyChartData = getMonthlyChartData();
  const weeklyData = getWeeklyData();
  const summary = revenueData?.summary || { totalSellerRevenue: 0, totalOrders: 0, totalItems: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-black dark:to-green-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-4">
            Seller Revenue
          </h1>
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full">
            <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-black dark:text-white text-sm">
              Revenue updates after order delivery • Analytics refresh daily
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Wallet}
            title="Total Revenue"
            value={summary.totalSellerRevenue}
            prefix="₹"
            trend={12.5}
            subtext={`From ${summary.totalOrders} orders`}
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={summary.totalOrders}
            subtext={`${summary.totalItems} items sold`}
          />
          <StatCard
            icon={Package}
            title="Items Sold"
            value={summary.totalItems}
            subtext={`Avg ${(summary.totalItems / summary.totalOrders).toFixed(1)} items/order`}
          />
          <StatCard
            icon={Calendar}
            title="Avg Order Value"
            value={summary.totalOrders > 0 ? summary.totalSellerRevenue / summary.totalOrders : 0}
            prefix="₹"
            subtext="Average per order"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Pie Chart */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Monthly Revenue</h2>
              <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            {monthlyChartData ? (
              <div className="h-80">
                <Pie 
                  data={monthlyChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { color: '#000' } }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-center text-black/60 dark:text-white/60 py-12">No data available</p>
            )}
          </div>

          {/* Weekly Revenue Bar Chart */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Weekly Revenue Trend</h2>
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            {weeklyData.length > 0 ? (
              <div className="h-80">
                <Bar
                  data={{
                    labels: weeklyData.map(w => w.week),
                    datasets: [{
                      label: 'Revenue',
                      data: weeklyData.map(w => w.revenue),
                      backgroundColor: '#22c55e',
                      borderRadius: 8,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: { callbacks: { label: (ctx) => `₹${ctx.raw.toLocaleString()}` } }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-center text-black/60 dark:text-white/60 py-12">No data available</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-black rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">Top Revenue Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center font-bold text-green-700 dark:text-green-300">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black dark:text-white">{product.title}</h3>
                  <p className="text-sm text-black/60 dark:text-white/60">Quantity: {product.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-black rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-black dark:text-white">Revenue Breakdown by Item</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-black border border-green-300 dark:border-green-700 rounded-lg text-black dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-green-200 dark:border-green-800">
                <tr className="text-left text-black/70 dark:text-white/70">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Details</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Base Price</th>
                  <th className="pb-3">Discount</th>
                  <th className="pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueData?.items?.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-b border-green-100 dark:border-green-900/50 hover:bg-green-50 dark:hover:bg-green-950/20 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.thumbnail} 
                          alt={item.product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-black dark:text-white">{item.product.title}</p>
                          <p className="text-sm text-black/60 dark:text-white/60">{item.product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-black dark:text-white">{item.product.category}</p>
                        <p className="text-xs text-black/60 dark:text-white/60">{item.variant.colorName}</p>
                      </div>
                    </td>
                    <td className="py-4 text-black dark:text-white">{item.quantity}</td>
                    <td className="py-4 text-black dark:text-white">₹{item.pricing.basePrice.toLocaleString()}</td>
                    <td className="py-4 text-red-500">-₹{item.pricing.totalDiscount.toLocaleString()}</td>
                    <td className="py-4 font-bold text-green-600 dark:text-green-400">₹{item.sellerRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {revenueData?.items?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-black/60 dark:text-white/60">No revenue data available</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SellerRevenue;