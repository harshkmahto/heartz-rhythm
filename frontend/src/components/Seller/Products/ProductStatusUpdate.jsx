import React, { useState } from 'react';
import { X, CheckCircle, Clock, Calendar, AlertCircle, Send } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateProductStatus } from '../../../utils/product.apiRequest';

const ProductStatusUpdate = ({ productId, onClose, onRefresh }) => {
  const [status, setStatus] = useState('draft');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await updateProductStatus(productId, status);
      if (response.success) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError(err.message || 'Failed to update product status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'active':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'draft':
        return <Clock size={18} className="text-amber-600" />;
      case 'scheduled':
        return <Calendar size={18} className="text-blue-600" />;
      default:
        return <AlertCircle size={18} className="text-gray-600" />;
    }
  };

  const getStatusDescription = (statusValue) => {
    switch (statusValue) {
      case 'active':
        return 'Product will be visible to customers and available for purchase';
      case 'draft':
        return 'Product is saved as draft and not visible to customers';
      case 'scheduled':
        return 'Product will be automatically published on the selected date and time';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden border border-green-200 dark:border-green-800 max-w-md w-full">
      {/* Header with Green Gradient */}
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="flex justify-between items-center p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-green-900 dark:text-green-100">Update Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-green-600 dark:text-green-400 mb-4">
          Change the visibility status of your product
        </p>

        {/* Status Options */}
        <div className="space-y-3 mb-6">
          {['active', 'draft', 'scheduled'].map((statusOption) => (
            <label
              key={statusOption}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                status === statusOption
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-green-200 dark:border-green-700 hover:border-green-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={statusOption}
                checked={status === statusOption}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-0.5 text-green-600 focus:ring-green-500 w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(statusOption)}
                  <span className="font-semibold text-green-900 dark:text-green-100 capitalize">
                    {statusOption}
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {getStatusDescription(statusOption)}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Date Picker for Scheduled Status */}
        {status === 'scheduled' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Schedule Date & Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              placeholderText="Click to select date and time"
              className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 cursor-pointer"
              calendarClassName="dark:bg-gray-800 dark:text-white"
            />
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              Select a future date and time for automatic publishing
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStatusChange}
            disabled={loading || (status === 'scheduled' && !selectedDateTime)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
            ) : (
              <><Send size={16} /> Update Status</>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Green Border */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
    </div>
  );
};

export default ProductStatusUpdate;