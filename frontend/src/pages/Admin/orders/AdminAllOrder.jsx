import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../../utils/order.apiRequest'; 
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  User,
  CreditCard,
  IndianRupee,
  RefreshCw,
  Tag,
  AlertCircle,
  TrendingUp,
  Wallet,
  ShoppingCart
} from 'lucide-react';

const AdminAllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    ordersByDate: {},
    paymentMethodStats: { cod: 0, online: 0 },
    avgOrderValue: 0,
    topProduct: { name: '', count: 0 }
  });

  const statusConfig = {
    placed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: Clock, label: 'Placed' },
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock, label: 'Pending' },
    processing: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: Package, label: 'Processing' },
    shipped: { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: Truck, label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, label: 'Cancelled' },
    returned: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: RefreshCw, label: 'Returned' },
    replaced: { color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300', icon: RefreshCw, label: 'Replaced' }
  };

  const paymentConfig = {
    success: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Success' },
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Failed' },
    review: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', label: 'Review' }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders({
        page: currentPage,
        limit: 100,
        status: 'all',
        paymentType: 'all',
        sortBy,
        sortOrder
      });
      
      if (response.success) {
        const allOrders = response.data.orders;
        setOrders(allOrders);
        setTotalOrders(response.data.pagination.totalOrders);
        setTotalPages(Math.ceil(allOrders.length / 10));
        
        applyFilters(allOrders);
        calculateAnalytics(allOrders);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (ordersList = orders) => {
    let filtered = [...ordersList];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentType === paymentFilter);
    }
    
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(search) ||
        order.user?.name?.toLowerCase().includes(search) ||
        order.user?.email?.toLowerCase().includes(search) ||
        order.items?.some(item => item.title.toLowerCase().includes(search))
      );
    }
    
    if (sortBy === 'createdAt') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === 'totalPrice') {
      filtered.sort((a, b) => {
        return sortOrder === 'desc' ? b.totalPrice - a.totalPrice : a.totalPrice - b.totalPrice;
      });
    }
    
    const startIndex = (currentPage - 1) * 10;
    const paginatedFiltered = filtered.slice(startIndex, startIndex + 10);
    setFilteredOrders(paginatedFiltered);
    setTotalPages(Math.ceil(filtered.length / 10));
  };

  const calculateAnalytics = (ordersList) => {
    const ordersByDate = {};
    let codCount = 0;
    let onlineCount = 0;
    let totalValue = 0;
    const productCount = {};
    
    ordersList.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
      
      if (order.paymentType === 'cod') codCount++;
      else if (order.paymentType === 'online') onlineCount++;
      
      totalValue += order.totalPrice;
      
      order.items?.forEach(item => {
        const productName = item.title;
        productCount[productName] = (productCount[productName] || 0) + item.quantity;
      });
    });
    
    const sortedDates = Object.entries(ordersByDate).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB - dateA;
    });
    
    let topProduct = { name: 'No data', count: 0 };
    Object.entries(productCount).forEach(([name, count]) => {
      if (count > topProduct.count) {
        topProduct = { name, count };
      }
    });
    
    setAnalytics({
      ordersByDate: Object.fromEntries(sortedDates.slice(0, 7)),
      paymentMethodStats: { cod: codCount, online: onlineCount },
      avgOrderValue: ordersList.length > 0 ? totalValue / ordersList.length : 0,
      topProduct: topProduct
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      applyFilters();
    }
  }, [searchTerm, statusFilter, paymentFilter, sortBy, sortOrder, currentPage]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const OrderCard = ({ order }) => {
    const StatusIcon = statusConfig[order.orderStatus]?.icon || Package;
    const isExpanded = expandedOrder === order.orderId;

    return (
      <div className="bg-white dark:bg-red-950/10 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 dark:border-red-800/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div 
          className="p-4 sm:p-6 cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-900/5 transition-colors"
          onClick={() => toggleExpandOrder(order.orderId)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Package className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">
                  #{order.orderId}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[order.orderStatus]?.color || 'bg-gray-100 text-gray-800'}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig[order.orderStatus]?.label || order.orderStatus}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentConfig[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'}`}>
                {paymentConfig[order.paymentStatus]?.label || order.paymentStatus}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                {order.paymentType === 'cod' ? 'COD' : 'Online'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-red-100 dark:border-red-800/20">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{order.user?.name || 'Guest'}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{order.user?.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{order.itemCount}</p>
              </div>
              <div className="text-red-500 dark:text-red-400">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-red-100 dark:border-red-800/20 bg-red-50/30 dark:bg-red-950/20 p-4 sm:p-6">
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Order Items ({order.items.length})
              </h4>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white dark:bg-red-950/5 rounded-xl border border-red-100 dark:border-red-800/20">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-red-900/20 flex-shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Color: {item.colorName || 'N/A'}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>Brand: {item.brand || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatPrice(item.sellingPrice)}</p>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(item.mrp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Price Details
              </h4>
              <div className="bg-white dark:bg-red-950/5 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatPrice(order.subTotal)}</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Discount ({order.discountCode || 'Coupon'})
                    </span>
                    <span>-{formatPrice(order.discountValue)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping Charge</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatPrice(order.shippingCharge)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatPrice(order.platformFee)}</span>
                </div>
                <div className="border-t border-dashed border-red-100 dark:border-red-800/20 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800 dark:text-gray-200">Total Amount</span>
                    <span className="text-red-600 dark:text-red-400 text-lg">{formatPrice(order.totalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                    {order.totalSaving > 0 && `You saved ${formatPrice(order.totalSaving)}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                to={`/admin/orders/details/${order.orderId}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Full Details
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-red-950/10 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-red-800/30 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-red-800/30 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-red-800/30 rounded-full"></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-red-800/20">
            <div className="flex justify-between">
              <div className="h-4 w-40 bg-gray-200 dark:bg-red-800/30 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-red-800/30 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const mostOrderedDate = Object.entries(analytics.ordersByDate).length > 0 
    ? Object.entries(analytics.ordersByDate).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    : 'No data';
  const maxOrders = Object.values(analytics.ordersByDate).length > 0 
    ? Math.max(...Object.values(analytics.ordersByDate))
    : 0;

  const totalPaymentMethods = analytics.paymentMethodStats.cod + analytics.paymentMethodStats.online;
  const codPercentage = totalPaymentMethods > 0 ? Math.round((analytics.paymentMethodStats.cod / totalPaymentMethods) * 100) : 0;
  const onlinePercentage = totalPaymentMethods > 0 ? Math.round((analytics.paymentMethodStats.online / totalPaymentMethods) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Package className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            All Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all customer orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-80">Peak Day</span>
            </div>
            <p className="text-3xl font-bold">{mostOrderedDate !== 'No data' ? mostOrderedDate : 'N/A'}</p>
            <p className="text-sm opacity-90 mt-1">Most orders: {maxOrders} orders</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Wallet className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-80">Payment Methods</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">COD</p>
                <p className="text-sm opacity-90">{analytics.paymentMethodStats.cod} orders ({codPercentage}%)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">Online</p>
                <p className="text-sm opacity-90">{analytics.paymentMethodStats.online} orders ({onlinePercentage}%)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <ShoppingCart className="w-8 h-8 opacity-80" />
              <span className="text-xs opacity-80">Top Product</span>
            </div>
            <p className="text-xl font-bold truncate">{analytics.topProduct.name !== 'No data' ? analytics.topProduct.name : 'N/A'}</p>
            <p className="text-sm opacity-90 mt-1">Sold: {analytics.topProduct.count} units</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{totalOrders}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Placed</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{orders.filter(o => o.orderStatus === 'placed').length}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Shipped</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{orders.filter(o => o.orderStatus === 'shipped').length}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Delivered</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{orders.filter(o => o.orderStatus === 'delivered').length}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{orders.filter(o => o.orderStatus === 'cancelled').length}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Returned</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{orders.filter(o => o.orderStatus === 'returned').length}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Replaced</p>
            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{orders.filter(o => o.orderStatus === 'replaced').length}</p>
          </div>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-3 border border-red-100 dark:border-red-800/30 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{orders.filter(o => o.orderStatus === 'pending').length}</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, User, Email, or Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white placeholder-gray-400"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="replaced">Replaced</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="cod">COD</option>
              <option value="online">Online</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white cursor-pointer"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="totalPrice-desc">Highest Price</option>
              <option value="totalPrice-asc">Lowest Price</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl">Try Again</button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Orders Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl transition-colors ${
                      currentPage === pageNum
                        ? 'bg-red-600 text-white'
                        : 'bg-white dark:bg-red-950/30 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllOrder;