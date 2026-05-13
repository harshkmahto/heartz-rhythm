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
  ShoppingBag
} from 'lucide-react';
import { getMyOrders } from '../../utils/order.apiRequest';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ShowCaseSection/Loader';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getMyOrders(params);
      if (response.success) {
        setOrders(response.data.orders);
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
      'placed': { label: 'Placed', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', progress: 0 },
      'pending': { label: 'Confirmed', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/20', progress: 25 },
      'processing': { label: 'Processing', icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', progress: 50 },
      'shipped': { label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20', progress: 75 },
      'delivered': { label: 'Delivered', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20', progress: 100 },
      'cancelled': { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20', progress: 0 }
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
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <Package className="w-10 h-10" />
            My Orders
          </h1>
          <p className="text-red-100 text-lg">Track and manage all your orders in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-red-200 dark:border-red-900 pb-4">
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
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300 border border-red-200 dark:border-red-900 hover:border-red-500 dark:hover:border-red-500'
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
            <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders yet</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
            >
              Start Shopping
            </button>
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
                  className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Order Header - Always Visible */}
                  <div
                    className="p-5 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                    onClick={() => toggleOrderExpand(order._id)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Thumbnail */}
                      <div className="col-span-2 md:col-span-1">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {order.item[0]?.thumbnail ? (
                            <img 
                              src={order.item[0].thumbnail} 
                              alt={order.item[0].title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order ID & Date */}
                      <div className="col-span-4 md:col-span-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">Order #{order.orderId}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Title & Brand */}
                      <div className="col-span-4 md:col-span-4">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
                          {order.item[0]?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.item[0]?.brand} • {order.itemCount} item(s)
                        </p>
                      </div>

                      {/* Total Price */}
                      <div className="col-span-1 text-right">
                        <p className="font-bold text-red-500 text-sm md:text-base">
                          ₹{order.totalPrice?.toLocaleString()}
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
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 mx-auto ${
                            expandedOrder === order._id ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="border-t border-red-200 dark:border-red-900 p-5 bg-red-50/30 dark:bg-red-950/5">
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
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                        : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-red-500/30' : ''}`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                  </div>
                                  <p
                                    className={`text-xs mt-2 font-medium ${
                                      isActive ? 'text-red-500' : 'text-gray-400'
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-4">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${statusConfig.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Cancelled Order Message */}
                      {isCancelled && (
                        <div className="mb-6 text-center py-4">
                          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                          <p className="text-red-500 font-semibold">Order Cancelled</p>
                        </div>
                      )}

                      {/* Delivered Message */}
                      {order.orderStatus === 'delivered' && (
                        <div className="mb-6 text-center py-4">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          <p className="text-green-500 font-semibold">Order Delivered Successfully!</p>
                        </div>
                      )}

                     

                      {/* View Details Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => navigate(`/order-details/${order.orderId}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all text-sm cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
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

export default MyOrders;