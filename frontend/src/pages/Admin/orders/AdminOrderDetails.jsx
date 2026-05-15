import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllOrderDetails } from '../../../utils/order.apiRequest';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  IndianRupee,
  Tag,
  AlertCircle,
  Mail,
  Phone,
  Store,
  Printer,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Banknote,
  Copy,
  Check,
  Building2,
  CalendarDays,
  RefreshCw,
  DollarSign
} from 'lucide-react';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSellers, setExpandedSellers] = useState({});
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

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
    success: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Success' },
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock, label: 'Pending' },
    failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, label: 'Failed' },
    review: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: AlertCircle, label: 'Review' }
  };

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
      setError(err.message || 'An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order?.orderId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSellerExpand = (sellerId) => {
    setExpandedSellers(prev => ({
      ...prev,
      [sellerId]: !prev[sellerId]
    }));
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

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalTitle = document.title;
    document.title = `Order_${order?.orderId || 'Details'}`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order ${order?.orderId || 'Details'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .print-container { max-width: 1200px; margin: 0 auto; }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent ? printContent.cloneNode(true).outerHTML : ''}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    document.title = originalTitle;
  };

  const getAddressName = (address) => {
    return address?.fullName || address?.name || 'N/A';
  };

  const getAddressLine = (address) => {
    return address?.addressLine1 || address?.address || 'N/A';
  };

  const getAddressLine2 = (address) => {
    return address?.addressLine2 || null;
  };

  const getZipCode = (address) => {
    return address?.pincode || address?.zipCode || 'N/A';
  };

  const getPhone = (address) => {
    return address?.phone || 'N/A';
  };

  const getSellerName = (seller) => {
    if (!seller) return 'Unknown Seller';
    return seller.brandName || seller.sellerName || seller.name || 'Unknown Seller';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-red-800/30 rounded"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-red-950/10 rounded-2xl p-6">
            <div className="h-6 w-32 bg-gray-200 dark:bg-red-800/30 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-red-800/30 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-red-800/30 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 dark:bg-red-800/30 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400 text-lg">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.orderStatus]?.icon || Package;
  const PaymentIcon = paymentConfig[order.paymentStatus]?.icon || CreditCard;
  const isCancelledOrReturned = order.orderStatus === 'cancelled' || order.orderStatus === 'returned';
  const isDelivered = order.orderStatus === 'delivered';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/orders')}
              className="p-2 bg-white dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  Order Details
                </h1>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-red-900/30 rounded-lg text-sm font-mono text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <span>#{order.orderId}</span>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Printer className="w-4 h-4" />
              Print Details
            </button>
          </div>
        </div>

        <div ref={printRef}>
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${statusConfig[order.orderStatus]?.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order Status</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {statusConfig[order.orderStatus]?.label || order.orderStatus}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-red-200 dark:bg-red-800/30 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${paymentConfig[order.paymentStatus]?.color || 'bg-gray-100'}`}>
                  <PaymentIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment Status</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {paymentConfig[order.paymentStatus]?.label || order.paymentStatus}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-red-200 dark:bg-red-800/30 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {order.paymentType === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-500" />
                    Order Timeline
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
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

              <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-500" />
                    Order Items ({order.itemCount} items)
                  </h2>
                </div>
                
                <div className="divide-y divide-red-100 dark:divide-red-800/30">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="p-4 sm:p-6 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to={`/admin/product/details/${item.product._id}`}>
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-red-900/20 flex-shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        </Link>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-red-900/20 rounded">Brand: {item.brand || 'N/A'}</span>
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-red-900/20 rounded">Category: {item.category || 'N/A'}</span>
                                {item.subCategory && (
                                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-red-900/20 rounded">Sub: {item.subCategory}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <div 
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: item.colorCode || '#000000' }}
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.colorName || 'Standard'}</span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                              </div>
                              {item.seller && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Store className="w-3 h-3" />
                                  <span>Seller: {getSellerName(item.seller)}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="flex flex-col items-end">
                                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                  {formatPrice(item.sellingPrice)}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-400 line-through">{formatPrice(item.mrp)}</span>
                                  <span className="text-green-600 dark:text-green-400">
                                    {Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)}% off
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Final Price: {formatPrice(item.finalPrice)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-red-500" />
                    Price Details
                  </h2>
                </div>
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total MRP</span>
                    <span className="text-gray-800 dark:text-gray-200">{formatPrice(order.totalMrp)}</span>
                  </div>
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
                  {order.totalSaving > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Total Savings</span>
                      <span>{formatPrice(order.totalSaving)}</span>
                    </div>
                  )}
                  <div className="border-t border-dashed border-red-100 dark:border-red-800/20 pt-3 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-800 dark:text-white">Total Amount</span>
                      <span className="text-red-600 dark:text-red-400 text-xl">{formatPrice(order.totalPrice)}</span>
                    </div>
                    {order.savingsPercentage && (
                      <p className="text-xs text-green-600 dark:text-green-400 text-right mt-1">
                        Saved {order.savingsPercentage}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Shipping Address
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  {order.billingAddress ? (
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-800 dark:text-white">{getAddressName(order.billingAddress)}</p>
                      <p>{getAddressLine(order.billingAddress)}</p>
                      {getAddressLine2(order.billingAddress) && <p>{getAddressLine2(order.billingAddress)}</p>}
                      <p>
                        {order.billingAddress.city || 'N/A'}, {order.billingAddress.state || 'N/A'}
                      </p>
                      <p>PIN Code: {getZipCode(order.billingAddress)}</p>
                      <p>Country: {order.billingAddress.country || 'India'}</p>
                      {order.billingAddress.landmark && (
                        <p>Landmark: {order.billingAddress.landmark}</p>
                      )}
                      <p className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {getPhone(order.billingAddress)}
                      </p>
                      {order.billingAddress.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {order.billingAddress.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No address information available</p>
                  )}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-red-500" />
                    Customer Information
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {order.user?.profilePicture ? (
                      <img src={order.user.profilePicture} alt={order.user.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <User className="w-8 h-8 text-red-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-lg">{order.user?.name || 'Guest User'}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Mail className="w-3 h-3" />
                        <span>{order.user?.email || 'No email'}</span>
                      </div>
                      {order.user?.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{order.user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {order.user?._id && (
                    <div className="pt-3 border-t border-red-100 dark:border-red-800/20">
                      <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
                      <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{order.user._id}</p>
                    </div>
                  )}
                </div>
              </div>

              {order.sellerBreakdown && order.sellerBreakdown.length > 0 && (
                <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-red-100 dark:border-red-800/30">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Store className="w-5 h-5 text-red-500" />
                      Seller Details ({order.sellerBreakdown.length} {order.sellerBreakdown.length === 1 ? 'Seller' : 'Sellers'})
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-red-100 dark:divide-red-800/30">
                    {order.sellerBreakdown.map((seller, idx) => {
                      const sellerData = seller.seller;
                      const sellerKey = sellerData?._id || idx;
                      return (
                        <div key={idx} className="p-4 sm:p-6">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSellerExpand(sellerKey)}
                          >
                            <div className="flex items-center gap-3">
                              {sellerData?.logo ? (
                                <img src={sellerData.logo} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                  <Store className="w-6 h-6 text-red-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                  {getSellerName(sellerData)}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  <span>{seller.itemCount} items</span>
                                  <span>•</span>
                                  <span>{formatPrice(seller.subtotal)}</span>
                                </div>
                              </div>
                            </div>
                            {expandedSellers[sellerKey] ? 
                              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                          
                          {expandedSellers[sellerKey] && sellerData && (
                            <div className="mt-4 pt-4 border-t border-red-100 dark:border-red-800/20">
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Contact Information</p>
                                  <div className="space-y-1.5">
                                    {sellerData.sellerEmail && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>{sellerData.sellerEmail}</span>
                                      </div>
                                    )}
                                    {sellerData.sellerPhone && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{sellerData.sellerPhone}</span>
                                      </div>
                                    )}
                                    {sellerData.brandEmail && !sellerData.sellerEmail && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>{sellerData.brandEmail}</span>
                                      </div>
                                    )}
                                    {sellerData.brandPhone && !sellerData.sellerPhone && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{sellerData.brandPhone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Business Details</p>
                                  <div className="space-y-1">
                                    {sellerData.brandCategory && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400">Category: {sellerData.brandCategory}</p>
                                    )}
                                    {sellerData.brandName && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400">Brand: {sellerData.brandName}</p>
                                    )}
                                    {sellerData.sellerName && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400">Seller: {sellerData.sellerName}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="pt-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Order Summary</p>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{formatPrice(seller.subtotal)}</span>
                                  </div>
                                  {seller.totalSaving > 0 && (
                                    <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mt-1">
                                      <span>Saved</span>
                                      <span>{formatPrice(seller.totalSaving)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link
                  to="/admin/orders"
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-red-950/30 text-gray-700 dark:text-gray-300 rounded-xl text-center font-medium hover:bg-gray-200 dark:hover:bg-red-900/40 transition-colors"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;