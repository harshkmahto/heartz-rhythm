import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Eye, 
  ChevronRight, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  RefreshCw,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Users,
  DollarSign,
  Star
} from 'lucide-react';
import { getSellerOrders } from '../../../utils/order.apiRequest';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/ShowCaseSection/Loader';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItems: 0,
    pendingOrders: 0
  });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getSellerOrders(params);
      if (response.success) {
        setOrders(response.data.orders);
        
        // Calculate statistics
        const totalRevenue = response.data.orders.reduce((sum, order) => sum + (order.subTotal || 0), 0);
        const totalItems = response.data.orders.reduce((sum, order) => sum + (order.itemCount || 0), 0);
        const pendingOrders = response.data.orders.filter(order => 
          ['placed', 'pending', 'processing'].includes(order.orderStatus)
        ).length;
        
        setStats({
          totalOrders: response.data.pagination.totalOrders,
          totalRevenue: totalRevenue,
          totalItems: totalItems,
          pendingOrders: pendingOrders
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getOrderStatusConfig = (status) => {
    const statusMap = {
      'placed': { label: 'Placed', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20', progress: 25 },
      'pending': { label: 'Confirmed', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/20', progress: 25 },
      'processing': { label: 'Processing', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20', progress: 50 },
      'shipped': { label: 'Shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20', progress: 75 },
      'delivered': { label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20', progress: 100 },
      'cancelled': { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20', progress: 0 }
    };
    return statusMap[status] || statusMap['placed'];
  };

  const getProgressSteps = () => {
    return [
      { key: 'placed', label: 'Placed', icon: Package },
      { key: 'processing', label: 'Processing', icon: RefreshCw },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];
  };

  const getCurrentProgressStep = (orderStatus) => {
    if (orderStatus === 'cancelled') return -1;
    const steps = ['placed', 'processing', 'shipped', 'delivered'];
    const index = steps.indexOf(orderStatus);
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-black dark:to-emerald-950/10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <Package className="w-10 h-10" />
            Seller Dashboard
          </h1>
          <p className="text-emerald-100 text-lg">Manage and track all your orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 shadow-lg hover:shadow-emerald-100/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalOrders}</span>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Total Orders</p>
          </div>

          <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{stats.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Total Revenue</p>
          </div>

          <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalItems}</span>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Total Items Sold</p>
          </div>

          <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.pendingOrders}</span>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Pending Orders</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-emerald-200 dark:border-emerald-800 pb-4">
          {[
            { key: 'all', label: 'All Orders', icon: Package },
            { key: 'placed', label: 'Placed', icon: Clock },
            { key: 'processing', label: 'Processing', icon: RefreshCw },
            { key: 'shipped', label: 'Shipped', icon: Truck },
            { key: 'delivered', label: 'Delivered', icon: CheckCircle },
            { key: 'cancelled', label: 'Cancelled', icon: XCircle }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                filter === tab.key
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white dark:bg-black text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 dark:hover:border-emerald-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-emerald-600 dark:text-emerald-400 mb-6">You haven't received any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.orderStatus);
              const StatusIcon = statusConfig.icon;
              const progressSteps = getProgressSteps();
              const currentStep = getCurrentProgressStep(order.orderStatus);
              const isCancelled = order.orderStatus === 'cancelled';

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Order Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/10 transition-colors"
                    onClick={() => toggleOrderExpand(order._id)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Thumbnail */}
                      <div className="col-span-2 md:col-span-1">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
                          {order.item[0]?.thumbnail ? (
                            <img 
                              src={order.item[0].thumbnail} 
                              alt={order.item[0].title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-emerald-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order ID & Date */}
                      <div className="col-span-4 md:col-span-3">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">#{order.orderId}</p>
                        <p className="text-xs text-emerald-500 dark:text-emerald-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="col-span-4 md:col-span-3">
                        <p className="font-semibold text-emerald-900 dark:text-white text-sm truncate">
                          {order.user?.name || 'Guest User'}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {order.itemCount} item(s)
                        </p>
                      </div>

                      {/* Total Price */}
                      <div className="col-span-1 text-right">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm md:text-base">
                          ₹{order.subTotal?.toLocaleString()}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${statusConfig.bg} w-fit`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                          <span className={`text-xs font-semibold ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="col-span-1 text-right">
                        <ChevronRight
                          className={`w-5 h-5 text-emerald-400 transition-transform duration-300 mx-auto ${
                            expandedOrder === order._id ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-emerald-200 dark:border-emerald-800 p-5 bg-emerald-50/30 dark:bg-emerald-950/5">
                      {/* Progress Bar */}
                      {!isCancelled && order.orderStatus !== 'delivered' && (
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            {progressSteps.map((step, idx) => {
                              const StepIcon = step.icon;
                              const isActive = idx <= currentStep;
                              const isCurrent = idx === currentStep;
                              return (
                                <div key={step.key} className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                      isActive
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-400'
                                    } ${isCurrent ? 'ring-4 ring-emerald-500/30' : ''}`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                  </div>
                                  <p
                                    className={`text-xs mt-2 font-medium ${
                                      isActive ? 'text-emerald-600' : 'text-emerald-400'
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2 mt-4">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${statusConfig.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 text-sm">
                          <ShoppingBag className="w-4 h-4 text-emerald-600" />
                          Order Items
                        </h4>
                        {order.item.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex gap-3 p-3 bg-white dark:bg-black rounded-xl border border-emerald-200 dark:border-emerald-800"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-emerald-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-emerald-900 dark:text-white text-sm">{item.title}</h5>
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                {item.brand} • {item.colorName} • Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                ₹{item.sellingPrice?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Customer Details */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 text-sm mb-3">
                          <Users className="w-4 h-4 text-emerald-600" />
                          Customer Details
                        </h4>
                        <div className="bg-white dark:bg-black p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <p className="text-sm text-emerald-800 dark:text-emerald-300">
                            <span className="font-medium">Name:</span> {order.user?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                            <span className="font-medium">Email:</span> {order.user?.email || 'N/A'}
                          </p>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                            <span className="font-medium">Phone:</span> {order.user?.phone || 'N/A'}
                          </p>
                        </div>
                      </div>

                    


                      {/* View Details Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => navigate(`/seller/orders/details/${order.orderId}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all text-sm cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;