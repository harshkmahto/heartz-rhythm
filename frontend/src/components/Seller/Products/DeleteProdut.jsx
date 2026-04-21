import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, Package, ShoppingBag } from 'lucide-react';
import { deleteProduct } from '../../../utils/product.apiRequest';

const DeleteProduct = ({ productId, productTitle, onClose, onRefresh }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        onRefresh();
        onClose();
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden border border-green-200 dark:border-green-800">
      {/* Header with Green Gradient */}
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
        <div className="flex justify-between items-center p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-green-900 dark:text-green-100">Delete Product</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>
        </div>
      </div>

      {/* Warning Section */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            Warning: This action cannot be undone!
          </p>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="px-5 py-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-black/40 rounded-lg">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Product to be deleted</p>
              <p className="font-semibold text-green-900 dark:text-green-100">{productTitle || 'Product'}</p>
              <p className="text-xs text-green-500 dark:text-green-500 mt-1 font-mono">ID: {productId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="px-5 pb-2">
        <p className="text-center text-green-700 dark:text-green-300 text-sm">
          This product will be permanently removed from your inventory.
          <br />
          <span className="text-red-600 dark:text-red-400 font-medium">This action cannot be undone.</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-5 mb-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-5 pt-3 border-t border-green-200 dark:border-green-800">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Green Border */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
    </div>
  );
};

export default DeleteProduct;