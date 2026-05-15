import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllOrderDetails } from '../../../utils/order.apiRequest';
import {
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  IndianRupee,
  Tag,
  Mail,
  Phone,
  Store,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  Eye,
  Building2,
  DollarSign,
  Repeat,
  RefreshCw
} from 'lucide-react';

const OrderDetailsModal = ({ orderId, onClose }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedSellerId, setCopiedSellerId] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrderDetails(orderId);
      
      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else if (type === 'user') {
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } else if (type === 'seller') {
      setCopiedSellerId(true);
      setTimeout(() => setCopiedSellerId(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    }).format(price || 0);
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
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Error</h2>
            <button onClick={onClose} className="p-1 hover:bg-red-600 rounded-lg transition-colors cursor-pointer">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400">{error || 'Order not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isCancelledOrReturned = order.orderStatus === 'cancelled' || order.orderStatus === 'returned';
  const isDelivered = order.orderStatus === 'delivered';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-red-900/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">Order Details</h2>
                <button
                  onClick={() => copyToClipboard(order.orderId, 'order')}
                  className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-lg text-xs text-white hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <span className="font-mono">{order.orderId}</span>
                  {copiedOrderId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-white/80 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
              <span className="text-black dark:text-white">Order Status: </span> {order.orderStatus?.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              <span className="text-black dark:text-white">Payment Method: </span> {order.paymentType === 'cod' ? 'COD' : 'ONLINE'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.paymentStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
              order.paymentStatus === 'refunded' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              <span className="text-black dark:text-white">Payment Status: </span> {order.paymentStatus?.toUpperCase()}
            </span>
          </div>

          <div className="rounded-xl">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-red-500" />
              Order Timeline
            </h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {order.timeline && order.timeline.filter(event => event.status !== 'payment_confirmed').length > 0 ? (
                  order.timeline.filter(event => event.status !== 'payment_confirmed').map((event, idx) => {
                    const isLast = idx === order.timeline.filter(e => e.status !== 'payment_confirmed').length - 1;
                    
                    const getIcon = (status) => {
                      switch(status) {
                        case 'placed': return <Clock className="w-4 h-4" />;
                        case 'processing': return <Package className="w-4 h-4" />;
                        case 'shipped': return <Truck className="w-4 h-4" />;
                        case 'delivered': return <CheckCircle className="w-4 h-4" />;
                        case 'cancelled': return <XCircle className="w-4 h-4" />;
                        case 'returned': return <RefreshCw className="w-4 h-4" />;
                        case 'replaced': return <Repeat className="w-4 h-4" />;
                        default: return <Clock className="w-4 h-4" />;
                      }
                    };
                    
                    const getBgColor = (status) => {
                      if (status === 'cancelled') return 'bg-red-500 text-white';
                      if (status === 'returned') return 'bg-orange-500 text-white';
                      if (status === 'delivered') return 'bg-green-500 text-white';
                      return 'bg-blue-500 text-white';
                    };
                    
                    return (
                      <div key={idx} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${getBgColor(event.status)} shadow-md`}>
                            {getIcon(event.status)}
                          </div>
                          <p className="text-xs font-medium mt-1 capitalize text-center text-gray-800 dark:text-white">
                            {event.status}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">
                            {formatDate(event.date)}
                          </p>
                        </div>
                        {!isLast && (
                          <div className="absolute top-4 left-[60%] w-full h-0.5 bg-green-500" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center w-full py-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium mt-1 capitalize text-center text-gray-800 dark:text-white">
                        placed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isCancelledOrReturned && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 dark:text-red-400 capitalize">
                    {order.orderStatus} Details
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    <span className="font-medium">Reason:</span> {order.cancelledReason || 'No reason provided'}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    <span className="font-medium">Cancelled By:</span> {order.cancelledBy || 'Admin'}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    <span className="font-medium">Cancelled At:</span> {formatDate(order.cancelledAt)}
                  </p>
                  {order.isRefunded && (
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800/30">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">Refund Processed</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        <span className="font-medium">Refund Amount:</span> {formatPrice(order.totalPrice)}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        <span className="font-medium">Refunded At:</span> {formatDate(order.refundedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isDelivered && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-400">Order Delivered</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    <span className="font-medium">Delivered At:</span> {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-red-500" />
              Order Items ({order.itemCount} items)
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-black rounded-xl p-4">
                  <div className="flex gap-4">
                    <Link to={`/admin/product/details/${item.product._id}`}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    </Link>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white">{item.title}</h4>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Brand: {item.brand || 'N/A'}</span>
                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Category: {item.category || 'N/A'}</span>
                        {item.subCategory && (
                          <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Sub: {item.subCategory}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.colorCode || '#000' }} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{item.colorName || 'Standard'}</span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">{formatPrice(item.mrp)}</span>
                          <span className="text-xs text-gray-500">Final: {formatPrice(item.finalPrice)}</span>
                          <span className="text-sm font-bold text-red-600 dark:text-red-400">Selling: {formatPrice(item.sellingPrice)}</span>
                        </div>
                      </div>
                      {item.seller && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Store className="w-3 h-3" />
                          <span>Seller: {item.seller.brandName || item.seller.sellerName || 'Unknown'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-black rounded-xl p-4">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
              <IndianRupee className="w-4 h-4 text-red-500" />
              Price Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-200">{formatPrice(order.subTotal)}</span>
              </div>
              {order.discount && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Discount {order.discountCode && `(${order.discountCode})`}
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
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800 dark:text-white">Total Amount</span>
                  <span className="text-red-600 dark:text-red-400">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-black rounded-xl p-4">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-red-500" />
              Shipping Address
            </h3>
            {order.billingAddress ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-800 dark:text-white">
                  {order.billingAddress.name || order.billingAddress.fullName || 'N/A'}
                </p>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-3 h-3" />
                  <span>{order.billingAddress.phone || 'N/A'}</span>
                  {order.billingAddress.alternatePhone && (
                    <span className="text-gray-500">(Alt: {order.billingAddress.alternatePhone})</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.billingAddress.address || order.billingAddress.addressLine1 || 'N/A'}
                </p>
                {order.billingAddress.landmark && (
                  <p className="text-gray-500 text-xs">Landmark: {order.billingAddress.landmark}</p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {order.billingAddress.city || 'N/A'}, {order.billingAddress.state || 'N/A'} - {order.billingAddress.zipCode || order.billingAddress.pincode || 'N/A'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Country: {order.billingAddress.country || 'India'}</p>
                <p className="text-xs text-gray-500">Type: {order.billingAddress.addressType || 'home'}</p>
              </div>
            ) : (
              <p className="text-gray-500">No address information available</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-black rounded-xl p-4">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-red-500" />
              Customer Information
            </h3>
            <div className="flex items-center gap-3">
              {order.user?.profilePicture ? (
                <img src={order.user.profilePicture} alt={order.user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-red-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">{order.user?.name || 'Guest User'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="w-3 h-3" />
                  <span>{order.user?.email || 'No email'}</span>
                </div>
                {order.user?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="w-3 h-3" />
                    <span>{order.user.phone}</span>
                  </div>
                )}
              </div>
              {order.user?._id && (
                <button
                  onClick={() => copyToClipboard(order.user._id, 'user')}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <span className="font-mono text-xs">ID</span>
                  {copiedUserId ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          {order.sellerBreakdown && order.sellerBreakdown.length > 0 && (
            <div className="bg-gray-50 dark:bg-black rounded-xl p-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
                <Store className="w-4 h-4 text-red-500" />
                Seller Details
              </h3>
              <div className="space-y-4">
                {order.sellerBreakdown.map((seller, idx) => (
                  <div key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start gap-3">
                      {seller.seller?.logo ? (
                        <img src={seller.seller.logo} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Store className="w-6 h-6 text-red-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {seller.seller?.brandName || seller.seller?.sellerName || 'Unknown Seller'}
                          </p>
                          {seller.seller?._id && (
                            <button
                              onClick={() => copyToClipboard(seller.seller._id, 'seller')}
                              className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                              <span className="font-mono text-xs">ID</span>
                              {copiedSellerId ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2 text-sm">
                          {seller.seller?.sellerName && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <User className="w-3 h-3" />
                              <span className="text-xs">{seller.seller.sellerName}</span>
                            </div>
                          )}
                          {seller.seller?.sellerEmail && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Mail className="w-3 h-3" />
                              <span className="text-xs">{seller.seller.sellerEmail}</span>
                            </div>
                          )}
                          {seller.seller?.sellerPhone && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{seller.seller.sellerPhone}</span>
                            </div>
                          )}
                          {seller.seller?.brandCategory && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Building2 className="w-3 h-3" />
                              <span className="text-xs">{seller.seller.brandCategory}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {seller.itemCount} items • {formatPrice(seller.subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/admin/orders/details/${order.orderId}`);
            }}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-red-600 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;