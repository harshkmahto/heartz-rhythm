import React, { useState } from 'react';
import { X, AlertTriangle, Shield, Ban, FileText, User, Package, Calendar, Clock, Send } from 'lucide-react';
import { blockProduct } from '../../../utils/product.apiRequest';

const BlockProducts = ({ product, productId, onClose, onBlockSuccess }) => {
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [error, setError] = useState('');

  const currentBlockStatus = product?.isBlocked || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentBlockStatus && !blockReason.trim()) {
      setError('Please provide a reason for blocking this product');
      return;
    }
    
    setIsBlocking(true);
    setError('');
    
    try {
      const response = await blockProduct(productId, {
        isBlocked: !currentBlockStatus,
        blockReason: blockReason
      });
      
      if (response.success) {
        if (onBlockSuccess) {
          onBlockSuccess(response.data);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error blocking product:', error);
      setError(error.message || 'Failed to block/unblock product');
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-black rounded-2xl shadow-2xl border border-red-100 dark:border-red-900 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentBlockStatus ? 'from-green-600 to-green-500' : 'from-red-600 to-red-500'} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              {currentBlockStatus ? <Shield className="text-white" size={20} /> : <Ban className="text-white" size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {currentBlockStatus ? 'Unblock Product' : 'Block Product'}
              </h2>
              <p className="text-red-100 text-sm">
                {currentBlockStatus ? 'Restore product visibility' : 'Restrict product from marketplace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-5 border-b border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {product?.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-red-200 dark:border-red-800"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border border-red-200 dark:border-red-800">
                  <Package className="text-red-400" size={28} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                {product?.title || 'Product'}
              </h3>
              {product?.brand && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  Brand: {product.brand}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                <span>ID: {productId?.slice(-8)}</span>
                {product?.status && (
                  <span className={`px-2 py-0.5 rounded-full ${
                    product.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {product.status}
                  </span>
                )}
                {product?.isBlocked && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Blocked
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Warning Message */}
          <div className={`rounded-xl p-3 border ${currentBlockStatus ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className={`mt-0.5 flex-shrink-0 ${currentBlockStatus ? 'text-green-500' : 'text-red-500'}`} />
              <p className={`text-xs ${currentBlockStatus ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {currentBlockStatus 
                  ? 'Unblocking this product will make it visible to customers again. Ensure the product complies with all policies before unblocking.'
                  : 'Blocking this product will remove it from public view. The seller will be notified of this action.'}
              </p>
            </div>
          </div>

          {/* Block Reason (only show when blocking) */}
          {!currentBlockStatus && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Block Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Please provide a detailed reason for blocking this product..."
                className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-gray-900 dark:text-white placeholder:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This reason will be shared with the seller.
              </p>
            </div>
          )}

          {/* Show current block info if already blocked */}
          {currentBlockStatus && product?.blockReason && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Previous Block Reason:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.blockReason}</p>
              {product.blockedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Blocked on: {new Date(product.blockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBlocking}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
                currentBlockStatus 
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
              }`}
            >
              {isBlocking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  {currentBlockStatus ? <Shield size={16} /> : <Ban size={16} />}
                  {currentBlockStatus ? 'Unblock Product' : 'Block Product'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Bottom Gradient Line */}
        <div className={`h-1 bg-gradient-to-r ${currentBlockStatus ? 'from-green-600 via-green-400 to-green-600' : 'from-red-600 via-red-400 to-red-600'}`}></div>
      </div>
    </div>
  );
};

export default BlockProducts;