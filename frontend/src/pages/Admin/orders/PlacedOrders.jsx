// pages/Admin/orders/PlacedOrders.jsx
import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';

const PlacedOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    getPaymentStatusColor
  } = useOrders('placed');

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
            Placed Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage orders that are placed and awaiting processing</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-red-950/20 backdrop-blur-sm rounded-2xl p-4 border border-red-100 dark:border-red-800/30">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Placed Orders</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalOrders}</p>
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
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/80 dark:bg-red-950/20 rounded-2xl border border-red-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Placed Orders Found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
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

        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl disabled:opacity-50 hover:bg-red-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
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

export default PlacedOrders;