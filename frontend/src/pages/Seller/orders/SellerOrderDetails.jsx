import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowLeft, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  RefreshCw,
  ShoppingBag,
  IndianRupee,
  Users,
  MapPin,
  CreditCard,
  Calendar,
  Percent,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  Home,
  Building,
  Info
} from 'lucide-react';
import { getSellerOrderById } from '../../../utils/order.apiRequest';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/ShowCaseSection/Loader';

const SellerOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getSellerOrderById(orderId);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
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

  const getItemStatusConfig = (status) => {
    const statusMap = {
      'pending': { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
      'processing': { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
      'shipped': { label: 'Shipped', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
      'delivered': { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
      'cancelled': { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
      'returned': { label: 'Returned', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/20' },
      'replaced': { label: 'Replaced', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-black dark:to-emerald-950/10 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-black dark:to-emerald-950/10 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Unable to load order details"}</p>
          <button
            onClick={() => navigate('/seller/orders')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getOrderStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const progressSteps = getProgressSteps();
  const currentStep = getCurrentProgressStep(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-black dark:to-emerald-950/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate('/seller/orders')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Package className="w-8 h-8" />
                Order Details
              </h1>
              <p className="text-emerald-100">Order #{order.orderId}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bg}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
              <span className={`font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            {!isCancelled && order.orderStatus !== 'delivered' && (
              <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
                <h3 className="font-semibold text-emerald-900 dark:text-white mb-4">Order Progress</h3>
                <div className="flex justify-between mb-2">
                  {progressSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isActive = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-400'
                          } ${isCurrent ? 'ring-4 ring-emerald-500/30' : ''}`}
                        >
                          <StepIcon className="w-5 h-5" />
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

            {/* Cancelled Info */}
            {isCancelled && order.cancelledReason && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400">Order Cancelled</h4>
                    <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                      Cancelled by: <span className="font-medium">{order.cancelledBy || 'Admin'}</span>
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                      Reason: {order.cancelledReason}
                    </p>
                    {order.cancelledAt && (
                      <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                      Date: {new Date(order.cancelledAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                Order Items ({order.itemCount} items)
              </h3>
              <div className="space-y-4">
                {order.item.map((item, idx) => {
                  const itemStatus = getItemStatusConfig(item.status?.status || 'pending');
                  const ItemStatusIcon = itemStatus.icon || Package;
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-emerald-50/30 dark:bg-emerald-950/5 rounded-xl border border-emerald-200 dark:border-emerald-800"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-emerald-900 dark:text-white">{item.title}</h4>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg ${itemStatus.bg}`}>
                            <ItemStatusIcon className={`w-3 h-3 ${itemStatus.color}`} />
                            <span className={`text-xs font-medium ${itemStatus.color}`}>{itemStatus.label}</span>
                          </div>
                        </div>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          {item.brand} • {item.colorName}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="space-y-1">
                            <p className="text-xs text-emerald-500 dark:text-emerald-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-xs text-emerald-500 dark:text-emerald-500 line-through">
                              MRP: ₹{item.mrp?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{item.sellingPrice?.toLocaleString()}
                            </p>
                            <p className="text-xs text-emerald-500 dark:text-emerald-500">
                              @ ₹{item.finalPrice?.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                        {/* Item cancellation reason if any */}
                        {item.status?.status === 'cancelled' && item.status?.cancelledReason && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <p className="text-xs text-red-600 dark:text-red-400">
                              <span className="font-medium">Cancelled:</span> {item.status.cancelledReason}
                              {item.status.cancelledBy && ` (by ${item.status.cancelledBy})`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-emerald-600" />
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Subtotal</span>
                  <span className="text-emerald-900 dark:text-white font-medium">₹{order.subTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Shipping Charge</span>
                  <span className="text-emerald-900 dark:text-white font-medium">₹{order.shippingCharge?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Platform Fee</span>
                  <span className="text-emerald-900 dark:text-white font-medium">₹{order.platformFee?.toLocaleString()}</span>
                </div>
                {order.discount && order.discountValue > 0 && (
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Percent className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Discount ({order.discountCode})</span>
                    </div>
                    <span className="text-green-600">-₹{order.discountValue?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-900 dark:text-white">Total Amount</span>
                  <span className="font-bold text-emerald-600 text-xl">₹{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Payment Method</span>
                  <span className="text-emerald-900 dark:text-white font-medium capitalize">
                    {order.paymentType === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Payment Status</span>
                  <span className={`font-medium capitalize ${
                    order.paymentStatus === 'success' ? 'text-green-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Order Date</span>
                  <span className="text-emerald-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-600" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Name:</span>
                  <span className="text-emerald-900 dark:text-white font-medium">{order.user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Email:</span>
                  <span className="text-emerald-900 dark:text-white">{order.user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Phone:</span>
                  <span className="text-emerald-900 dark:text-white">{order.user?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.billingAddress && (
              <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
                <h3 className="font-semibold text-emerald-900 dark:text-white flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Shipping Address
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-emerald-900 dark:text-white">{order.billingAddress.name}</p>
                  <p className="text-emerald-600 dark:text-emerald-400">{order.billingAddress.address}</p>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    {order.billingAddress.city}, {order.billingAddress.state}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400">PIN: {order.billingAddress.zipCode}</p>
                  <p className="text-emerald-600 dark:text-emerald-400">Phone: {order.billingAddress.phone}</p>
                  {order.billingAddress.landmark && (
                    <p className="text-emerald-600 dark:text-emerald-400">Landmark: {order.billingAddress.landmark}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;