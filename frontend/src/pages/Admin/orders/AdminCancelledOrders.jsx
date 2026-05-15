import React, { useState, useEffect } from 'react';
import useOrders from '../../../hooks/useOrders';
import OrderCard from '../../../components/Admin/orders/OrderCard';
import UpdateOrderStatusModal from '../../../components/Admin/orders/UpdateOrderStatus';
import OrderDetailsModal from '../../../components/Admin/orders/OrderDeatilsModal';
import RefundStatus from '../../../components/Admin/orders/RefundStatus';
import {
  Package,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  Trash2,
  User,
  Shield,
  Users,
  XCircle,
  Calendar
} from 'lucide-react';

const AdminCancelledOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelledByFilter, setCancelledByFilter] = useState('all');

  const {
    filteredOrders,
    loading,
    error,
    refreshing,
    deleting,
    searchTerm,
    setSearchTerm,
    paymentFilter,
    setPaymentFilter,
    dateRange,
    setDateRange,
    currentPage,
    setCurrentPage,
    totalPages,
    totalOrders,
    copiedId,
    copyOrderId,
    handleRefresh,
    handleDeleteOrder,
    formatDate,
    formatPrice,
    getStatusColor,
    getPaymentStatusColor,
    orders
  } = useOrders('cancelled');

  const [stats, setStats] = useState({
    total: 0,
    cancelledByAdmin: 0,
    cancelledByUser: 0,
    cancelledBySeller: 0
  });

  useEffect(() => {
    if (orders.length > 0) {
      const adminCount = orders.filter(o => o.cancelledBy === 'admin').length;
      const userCount = orders.filter(o => o.cancelledBy === 'customer').length;
      const sellerCount = orders.filter(o => o.cancelledBy === 'seller').length;
      
      setStats({
        total: orders.length,
        cancelledByAdmin: adminCount,
        cancelledByUser: userCount,
        cancelledBySeller: sellerCount
      });
    }
  }, [orders]);

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    if (cancelledByFilter !== 'all') {
      filtered = filtered.filter(order => order.cancelledBy === cancelledByFilter);
    }
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentType === paymentFilter);
    }
    
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(search) ||
        order.user?.name?.toLowerCase().includes(search) ||
        order.user?.email?.toLowerCase().includes(search)
      );
    }
    
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(order => new Date(order.createdAt) >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(order => new Date(order.createdAt) <= endDate);
    }
    
    const startIndex = (currentPage - 1) * 10;
    const paginatedFiltered = filtered.slice(startIndex, startIndex + 10);
    return { filtered: paginatedFiltered, totalPages: Math.ceil(filtered.length / 10), total: filtered.length };
  };

  const { filtered: displayOrders, totalPages: displayTotalPages, total: displayTotal } = getFilteredOrders();

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

  const CancelledByTab = ({ label, value, icon: Icon, color, count }) => (
    <button
      onClick={() => setCancelledByFilter(value)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
        cancelledByFilter === value
          ? `${color} text-white shadow-lg`
          : 'bg-white/80 dark:bg-red-950/30 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/30 cursor-pointer'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
        cancelledByFilter === value ? 'bg-white/20' : 'bg-gray-100 dark:bg-red-900/50'
      }`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            Cancelled Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage cancelled orders and track cancellation reasons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Cancelled</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">By Admin</p>
                <p className="text-3xl font-bold">{stats.cancelledByAdmin}</p>
              </div>
              <Shield className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">By Customer</p>
                <p className="text-3xl font-bold">{stats.cancelledByCustomer}</p>
              </div>
              <User className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">By Seller</p>
                <p className="text-3xl font-bold">{stats.cancelledBySeller}</p>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
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
          <div className="flex gap-4  overflow-x-auto scrollbar-hide scroll-smooth">
            <CancelledByTab 
              label="All Cancelled" 
              value="all" 
              icon={XCircle}
              color="bg-red-600"
              count={stats.total}
            />
            <CancelledByTab 
              label="Cancelled by Admin" 
              value="admin" 
              icon={Shield}
              color="bg-purple-600"
              count={stats.cancelledByAdmin}
            />
            <CancelledByTab 
              label="Cancelled by Customer" 
              value="customer" 
              icon={User}
              color="bg-blue-600"
              count={stats.cancelledByUser}
            />
            <CancelledByTab 
              label="Cancelled by Seller" 
              value="seller" 
              icon={Users}
              color="bg-green-600"
              count={stats.cancelledBySeller}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600">{error}</p>
            <button onClick={handleRefresh} className="cursor-pointer mt-4 px-4 py-2 bg-red-600 text-white rounded-xl">Try Again</button>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="bg-white/80 dark:bg-red-950/20 rounded-2xl border border-red-100 p-12 text-center">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Cancelled Orders Found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => (
              <div key={order.orderId} className="relative">
                {order.cancelledBy && (
                  <div className="absolute top-2 right-4 z-10">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      order.cancelledBy === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      order.cancelledBy === 'customer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {order.cancelledBy === 'admin' && <Shield className="w-3 h-3" />}
                      {order.cancelledBy === 'customer' && <User className="w-3 h-3" />}
                      {order.cancelledBy === 'seller' && <Users className="w-3 h-3" />}
                      Cancelled by {order.cancelledBy}
                    </span>
                  </div>
                )}
                <OrderCard
                  order={order}
                  onUpdateStatus={(order) => {
                    setSelectedOrder(order);
                    setShowStatusModal(true);
                  }}
                  onViewDetails={(order) => {
                    setSelectedOrder(order);
                    setShowDetailsModal(true);
                  }}
                  onDelete={(order) => {
                    setSelectedOrder(order);
                    setShowDeleteModal(true);
                  }}
                  onRefund={(order) => {
                    setSelectedOrder(order);
                    setShowRefundModal(true);
                  }}
                  copiedId={copiedId}
                  copyOrderId={copyOrderId}
                  formatDate={formatDate}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                  getPaymentStatusColor={getPaymentStatusColor}
                />
                
              </div>
            ))}
          </div>
        )}

        {!loading && displayTotalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {currentPage} of {displayTotalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(displayTotalPages, prev + 1))}
              disabled={currentPage === displayTotalPages}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 transition-colors"
            >
              Next
            </button>
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
            handleRefresh();
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
            handleRefresh();
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
                Are you sure you want to delete order <span className="font-mono font-medium">#{selectedOrder.orderId}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="cursor-pointer flex-1 px-4 py-2 bg-gray-100 dark:bg-red-900 text-gray-700 rounded-xl">Cancel</button>
                <button 
                  onClick={async () => {
                    const success = await handleDeleteOrder(selectedOrder.orderId);
                    if (success) {
                      setShowDeleteModal(false);
                      setSelectedOrder(null);
                    }
                  }} 
                  disabled={deleting} 
                  className="cursor-pointer flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl flex items-center justify-center gap-2"
                >
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

export default AdminCancelledOrders;