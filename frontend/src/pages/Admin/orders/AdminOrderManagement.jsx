import React, { useState, useEffect, useRef } from 'react';
import { getAllOrders, deleteOrder } from '../../../utils/order.apiRequest';
import UpdateOrderStatusModal from '../../../components/Admin/orders/UpdateOrderStatus';
import OrderDetailsModal from '../../../components/Admin/orders/OrderDeatilsModal';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Copy,
  Check,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RefundStatus from '../../../components/Admin/orders/RefundStatus';
import { formatDate, formatPrice } from '../../../Helper/Format';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);
  
  const tabsRef = useRef(null);
  
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    delivered: 0,
    cancelled: 0,
    pending: 0,
    refund: 0,
    revenue: 0
  });

  const statusTabs = [
    { key: 'all', label: 'All Orders', icon: ShoppingBag },
    { key: 'placed', label: 'Placed', icon: Clock },
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    { key: 'cancelled', label: 'Cancelled', icon: XCircle },
    { key: 'returned', label: 'Returned', icon: RefreshCw },
    { key: 'replaced', label: 'Replaced', icon: RefreshCw }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders();
      
      if (response.success) {
        const ordersData = response.data.orders;
        setOrders(ordersData);
        
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        const newStats = {
          total: ordersData.length,
          placed: ordersData.filter(o => o.orderStatus === 'placed').length,
          delivered: ordersData.filter(o => o.orderStatus === 'delivered').length,
          cancelled: ordersData.filter(o => o.orderStatus === 'cancelled').length,
          pending: ordersData.filter(o => o.orderStatus === 'pending').length,
          refund: ordersData.filter(o => o.paymentStatus === 'refunded').length,
          revenue: totalRevenue
        };
        setStats(newStats);
        
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 1000);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus;
    const matchesPayment = paymentFilter === 'all' || order.paymentType === paymentFilter;
    const matchesSearch = searchTerm === '' || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange.start) {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(dateRange.start);
      matchesDate = orderDate >= startDate;
    }
    if (dateRange.end && matchesDate) {
      const orderDate = new Date(order.createdAt);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      matchesDate = orderDate <= endDate;
    }
    
    return matchesStatus && matchesPayment && matchesSearch && matchesDate;
  });

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setDeleting(true);
      const response = await deleteOrder(selectedOrder.orderId);
      
      if (response.success) {
        await fetchOrders();
        setShowDeleteModal(false);
        setSelectedOrder(null);
      } else {
        setError(response.message || 'Failed to delete order');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting order');
    } finally {
      setDeleting(false);
    }
  };

  

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      replaced: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const StatCard = ({ title, value, icon: Icon, color, prefix = '' }) => (
    <div className={`bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${animateStats ? 'animate-pulse-scale' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {prefix}{title === 'Revenue' ? formatPrice(value) : value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => {
    const firstItem = order.items?.[0];
    
    return (
      <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30 bg-red-50/30 dark:bg-red-950/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => copyOrderId(order.orderId)}
                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <span className="font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">
                  #{order.orderId}
                </span>
                {copiedId === order.orderId ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus?.toUpperCase()}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus?.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300">
                {order.paymentType === 'cod' ? 'COD' : 'ONLINE'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {firstItem && (
            <div className="flex gap-4 pb-4 border-b border-red-100 dark:border-red-800/20">
              <Link to={`/admin/product/details/${firstItem.product._id}`}>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-red-900/20 flex-shrink-0">
                {firstItem.thumbnail ? (
                  <img src={firstItem.thumbnail} alt={firstItem.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              </Link>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{firstItem.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: firstItem.colorCode || '#000' }}
                    />
                    <span>{firstItem.colorName || 'Standard'}</span>
                  </div>
                  <span>Qty: {firstItem.quantity}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-sm text-gray-400 line-through">{formatPrice(firstItem.mrp)}</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Final: {formatPrice(firstItem.finalPrice)}</span>
                  <span className="text-base font-bold text-red-600 dark:text-red-400">{formatPrice(firstItem.sellingPrice)}</span>
                </div>
                {order.items?.length > 1 && (
                  <p className="text-xs text-gray-500 mt-2">+{order.items.length - 1} more item(s)</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{order.user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{order.user?.email || 'No email'}</p>
                </div>
              </div>
              {order.billingAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{order.billingAddress.name || order.billingAddress.fullName}</p>
                    <p className="text-xs text-gray-500">{order.billingAddress.city}, {order.billingAddress.state}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1 p-3 bg-gray-50 dark:bg-red-950/30 rounded-xl">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPrice(order.subTotal)}</span>
              </div>
              {order.discount && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Discount {order.discountCode && `(${order.discountCode})`}</span>
                  <span>-{formatPrice(order.discountValue)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPrice(order.shippingCharge)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Platform Fee</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPrice(order.platformFee)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-red-800/20">
                <span className="text-gray-800 dark:text-white">Total</span>
                <span className="text-red-600 dark:text-red-400">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-red-100 dark:border-red-800/20">
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowStatusModal(true);
              }}
              className="cursor-pointer flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Update Status
            </button>

             {order.orderStatus === 'delivered' || order.orderStatus === 'cancelled' || order.orderStatus === 'returned'  && (
              <button
              onClick={() => {
                setSelectedOrder(order);
                setShowRefundModal(true);
              }}
              className="cursor-pointer flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-4 h-4" />
              Refund Status
            </button>
             )}

            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowDetailsModal(true);
              }}
              className="cursor-pointer flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>

            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowDeleteModal(true);
              }}
              className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/80 dark:bg-red-950/20 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-red-800/30 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-red-800/30 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-red-800/30 rounded-full"></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-red-800/30 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-200 dark:bg-red-800/30 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-red-800/30 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Package className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all customer orders from one place</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <StatCard title="Total Orders" value={stats.total} icon={ShoppingBag} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
          <StatCard title="Placed" value={stats.placed} icon={Clock} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
          <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
          <StatCard title="Refund" value={stats.refund} icon={RefreshCw} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        </div>

        <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white"
              />
            </div>
            
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="cursor-pointer px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white"
            >
              <option value="all">All Payments</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
            
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="cursor-pointer px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white [color-scheme:dark]"
            />
            
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="cursor-pointer px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="relative mb-6">
          <button 
            onClick={() => scrollTabs('left')} 
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white dark:bg-red-950/80 rounded-full shadow-md border border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {statusTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = selectedStatus === tab.key;
              const count = tab.key === 'all' ? stats.total : stats[tab.key];
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-white/80 dark:bg-red-950/30 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-red-900/50'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => scrollTabs('right')} 
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white dark:bg-red-950/80 rounded-full shadow-md border border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600">{error}</p>
            <button onClick={fetchOrders} className="cursor-pointer mt-4 px-4 py-2 bg-red-600 text-white rounded-xl">Try Again</button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/80 dark:bg-red-950/20 rounded-2xl border border-red-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>

      {showStatusModal && selectedOrder && (
        <UpdateOrderStatusModal
          order={selectedOrder}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => {
            fetchOrders();
            setShowStatusModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showRefundModal && selectedOrder && (
        <RefundStatus
          order={selectedOrder}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => {
            fetchOrders();
            setShowRefundModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder.orderId}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Delete Order</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete order <span className="font-mono font-medium">#{selectedOrder.orderId}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="cursor-pointer flex-1 px-4 py-2 bg-gray-100 dark:bg-red-900 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-red-800/30 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteOrder} disabled={deleting} className="cursor-pointer flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl flex items-center justify-center gap-2">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;