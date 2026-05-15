import React, { useState } from 'react';
import { updateOrderStatus } from '../../../utils/order.apiRequest';
import {
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Wallet,
  DollarSign,
  IndianRupee
} from 'lucide-react';

const UpdateOrderStatus = ({ order, onClose, onSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
  const [cancelledReason, setCancelledReason] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [processRefund, setProcessRefund] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 'placed', label: 'Placed', icon: Clock, color: 'blue' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'indigo' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'purple' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
    { value: 'returned', label: 'Returned', icon: RefreshCw, color: 'orange' },
    { value: 'replaced', label: 'Replaced', icon: RefreshCw, color: 'cyan' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
  ];

  const getStatusColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
    };
    return colors[color] || colors.blue;
  };

  const getSelectedButtonClass = (statusColor, isSelected, isCurrent) => {
    if (isCurrent) {
      return 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500';
    }
    if (isSelected) {
      const bgColors = {
        blue: 'bg-blue-600 text-white',
        yellow: 'bg-yellow-600 text-white',
        purple: 'bg-purple-600 text-white',
        indigo: 'bg-indigo-600 text-white',
        green: 'bg-green-600 text-white',
        red: 'bg-red-600 text-white',
        orange: 'bg-orange-600 text-white',
        cyan: 'bg-cyan-600 text-white'
      };
      return bgColors[statusColor] || 'bg-gray-600 text-white';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedStatus === order.orderStatus) {
      onClose();
      return;
    }

    if ((selectedStatus === 'cancelled' || selectedStatus === 'returned') && !cancelledReason.trim()) {
      setError('Please provide a reason');
      return;
    }

    if (processRefund && !refundReason.trim()) {
      setError('Please provide a refund reason');
      return;
    }

    if (processRefund && order.paymentType === 'cod') {
      setError('COD orders cannot be auto-refunded. Please process refund manually.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await updateOrderStatus(
        order.orderId, 
        selectedStatus, 
        cancelledReason, 
        processRefund
      );
      
      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to update order status');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating status');
    } finally {
      setLoading(false);
    }
  };

  const selectedStatusOption = statusOptions.find(opt => opt.value === selectedStatus);
  const SelectedIcon = selectedStatusOption?.icon || Package;
  const showRefundToggle = (selectedStatus === 'cancelled' || selectedStatus === 'returned') && order.paymentType === 'online';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Update Order Status</h2>
                <p className="text-sm text-white/80 mt-0.5">
                  Order #{order.orderId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Status</p>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${getStatusColor(
                statusOptions.find(opt => opt.value === order.orderStatus)?.color || 'blue'
              )}`}>
                {statusOptions.find(opt => opt.value === order.orderStatus)?.icon && 
                  React.createElement(statusOptions.find(opt => opt.value === order.orderStatus).icon, { className: "w-4 h-4" })
                }
              </div>
              <span className="font-medium text-gray-800 dark:text-white capitalize">
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => {
                const Icon = status.icon;
                const isSelected = selectedStatus === status.value;
                const isCurrent = order.orderStatus === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setSelectedStatus(status.value)}
                    disabled={isCurrent}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${getSelectedButtonClass(status.color, isSelected, isCurrent)}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{status.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {(selectedStatus === 'cancelled' || selectedStatus === 'returned') && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  {selectedStatus === 'cancelled' ? 'Cancellation' : 'Return'} Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelledReason}
                  onChange={(e) => setCancelledReason(e.target.value)}
                  placeholder={`Please provide a reason for ${selectedStatus === 'cancelled' ? 'cancelling' : 'returning'} this order...`}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-800 dark:text-white"
                />
              </div>

              {showRefundToggle && (
                <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Process Refund
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProcessRefund(!processRefund)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                        ${processRefund ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${processRefund ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                  
                  {processRefund && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                        <Wallet className="w-4 h-4" />
                        Refund Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="Please provide a reason for refund..."
                        rows="2"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-800 dark:text-white"
                      />
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Amount to refund: ₹{order.totalPrice?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Refund will be processed to the original payment method
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${getStatusColor(selectedStatusOption?.color)}`}>
                <SelectedIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white capitalize">
                  {selectedStatusOption?.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Status will be updated from {order.orderStatus} to {selectedStatus}
                </p>
                {processRefund && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Refund will be processed automatically
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedStatus === order.orderStatus}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-red-400 disabled:to-red-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>

        <div className="sticky bottom-0 bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 p-3 text-center">
          <p className="text-xs text-white/70">Order Management System</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;