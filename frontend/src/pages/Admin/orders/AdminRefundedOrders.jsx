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
  DollarSign,
  TrendingDown,
  Percent,
  Wallet
} from 'lucide-react';

const AdminRefundedOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localStats, setLocalStats] = useState({
    total: 0,
    totalRefundAmount: 0,
    averageRefundAmount: 0,
    refundPercentage: 0
  });

  const {
    orders: allOrders,
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
    copiedId,
    copyOrderId,
    handleRefresh,
    handleDeleteOrder,
    formatDate,
    formatPrice,
    getStatusColor,
    getPaymentStatusColor,
    totalOrders
  } = useOrders(null, 'refunded');

  const [filteredRefundedOrders, setFilteredRefundedOrders] = useState([]);
  const [displayTotalPages, setDisplayTotalPages] = useState(1);

  useEffect(() => {
    if (allOrders.length > 0) {
      const totalRefundAmount = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const averageRefundAmount = totalRefundAmount / allOrders.length;
      const refundPercentage = totalOrders > 0 ? (allOrders.length / totalOrders) * 100 : 0;
      
      setLocalStats({
        total: allOrders.length,
        totalRefundAmount: totalRefundAmount,
        averageRefundAmount: averageRefundAmount,
        refundPercentage: refundPercentage
      });
      
      applyLocalFilters(allOrders);
    }
  }, [allOrders, totalOrders]);

  const applyLocalFilters = (ordersList) => {
    let filtered = [...ordersList];
    
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
    setFilteredRefundedOrders(paginatedFiltered);
    setDisplayTotalPages(Math.ceil(filtered.length / 10));
  };

  useEffect(() => {
    if (allOrders.length > 0) {
      applyLocalFilters(allOrders);
    }
  }, [searchTerm, paymentFilter, dateRange, currentPage, allOrders]);

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
        </div>
      ))}
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }) => (
    <div className="bg-gradient-to-br rounded-2xl p-4 text-white shadow-lg" style={{ background: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</p>
        </div>
        <Icon className="w-8 h-8 opacity-80" />
      </div>
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
            Refunded Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage orders that have been refunded</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Refunded Orders" 
            value={localStats.total} 
            icon={Wallet}
            color="linear-gradient(135deg, #ef4444, #dc2626)"
          />
          <StatCard 
            title="Total Refund Amount" 
            value={formatPrice(localStats.totalRefundAmount)} 
            icon={DollarSign}
            color="linear-gradient(135deg, #f59e0b, #d97706)"
          />
          <StatCard 
            title="Average Refund Amount" 
            value={formatPrice(localStats.averageRefundAmount)} 
            icon={TrendingDown}
            color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
          />
          <StatCard 
            title="Refund Percentage" 
            value={localStats.refundPercentage.toFixed(2)} 
            icon={Percent}
            suffix="%"
            color="linear-gradient(135deg, #06b6d4, #0891b2)"
          />
        </div>

        <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl border border-red-100 dark:border-red-800/30 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white"
              />
            </div>
            
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white"
            >
              <option value="all">All Payments</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
            
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange(prev => ({ ...prev, start: e.target.value }));
                setCurrentPage(1);
              }}
              className="cursor-pointer px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white [color-scheme:dark]"
            />
            
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange(prev => ({ ...prev, end: e.target.value }));
                setCurrentPage(1);
              }}
              className="cursor-pointer px-4 py-2.5 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white [color-scheme:dark]"
            />
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="cursor-pointer px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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
        ) : filteredRefundedOrders.length === 0 ? (
          <div className="bg-white/80 dark:bg-red-950/20 rounded-2xl border border-red-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Refunded Orders Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRefundedOrders.map((order) => (
              <OrderCard
                key={order.orderId}
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
            ))}
          </div>
        )}

        {!loading && displayTotalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {currentPage} of {displayTotalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(displayTotalPages, prev + 1))}
              disabled={currentPage === displayTotalPages}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 transition-colors cursor-pointer"
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

export default AdminRefundedOrders;