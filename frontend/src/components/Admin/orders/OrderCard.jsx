import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  User,
  Calendar,
  Copy,
  Check,
  MapPin,
  IndianRupee
} from 'lucide-react';

const OrderCard = ({ order, onUpdateStatus, onViewDetails, onDelete, onRefund, copiedId, copyOrderId, formatDate, formatPrice, getStatusColor, getPaymentStatusColor }) => {
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
            <Link to={`/admin/product/details/${firstItem.product?._id}`}>
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
            onClick={() => onUpdateStatus(order)}
            className="cursor-pointer flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Update Status
          </button>

         
          <button
            onClick={() => onViewDetails(order)}
            className="cursor-pointer flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={() => onDelete(order)}
            className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;