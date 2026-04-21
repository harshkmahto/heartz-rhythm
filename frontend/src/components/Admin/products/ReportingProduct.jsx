// ReportingProduct.jsx
import React, { useState } from 'react';
import { X, AlertTriangle, Flag, Send, Package, Star, Calendar, User, Mail } from 'lucide-react';

const ReportingProduct = ({ productId, product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    reportType: 'inappropriate'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const reportOptions = [
    { value: 'inappropriate', label: 'Inappropriate Content', icon: AlertTriangle },
    { value: 'spam', label: 'Spam or Misleading', icon: Flag },
    { value: 'fake', label: 'Fake Product/Counterfeit', icon: Package },
    { value: 'pricing', label: 'Wrong Pricing', icon: Star },
    { value: 'outdated', label: 'Outdated Information', icon: Calendar },
    { value: 'other', label: 'Other Issues', icon: Mail }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject/Regarding is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          productId,
          ...formData
        });
      }
      // Close modal after successful submission
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-2xl border border-red-100 dark:border-red-900 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header with Red Gradient */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Flag className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Product</h2>
              <p className="text-red-100 text-sm">Help us keep the marketplace safe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Summary Card */}
        <div className="p-6 border-b border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10">
          <div className="flex gap-4">
            {/* Product Thumbnail */}
            <div className="flex-shrink-0">
              {product?.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-20 h-20 rounded-lg object-cover border border-red-200 dark:border-red-800"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border border-red-200 dark:border-red-800">
                  <Package className="text-red-400" size={32} />
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100 text-lg">
                {product?.title || 'Product'}
              </h3>
              {product?.brand && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  Brand: {product.brand}
                </p>
              )}
              {product?.category && (
                <p className="text-black dark:text-white text-xs mt-1">
                  Category: {product.category}
                  {product.subCategory && ` > ${product.subCategory}`}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-700 dark:text-gray-300">
                <span>ID: {productId?.slice(-8)}</span>
                {product?.status && (
                  <span className='text-green-600 dark:text-green-400'>Status: {product.status}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
              Report Issue Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {reportOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.reportType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, reportType: option.value }))}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/50 border-red-500 ring-2 ring-red-500/20'
                        : 'bg-white dark:bg-black/40 border-red-200 dark:border-red-800 hover:border-red-400 cursor-pointer'
                    }`}
                  >
                    <Icon size={16} className={isSelected ? 'text-red-600' : 'text-red-400'} />
                    <span className={`text-sm ${isSelected ? 'text-red-800 dark:text-red-300 font-medium' : 'text-red-600 dark:text-red-400'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject/Regarding Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
              Subject / Regarding <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Product description mismatch, Wrong pricing, etc."
              className={`w-full px-4 py-2.5 bg-white dark:bg-black/60 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-black dark:text-white placeholder:text-gray-700 dark:placeholder:text-gray-400 ${
                errors.subject ? 'border-red-500' : 'border-red-200 dark:border-red-800'
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
              Message / Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide detailed information about the issue you're reporting..."
              className={`w-full px-4 py-2.5 bg-white dark:bg-black/60 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-black dark:text-white placeholder:text-gray-700 dark:placeholder:text-gray-400 ${
                errors.message ? 'border-red-500' : 'border-red-200 dark:border-red-800'
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">{errors.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-400">
              Minimum 10 characters. Be specific about the issue.
            </p>
          </div>

          {/* Additional Info Note */}
          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3 border border-red-100 dark:border-red-900/30">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">
                Your report will be reviewed by our moderation team. False reports may lead to account restrictions.
              </p>
            </div>
          </div>

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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent "></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>

        {/* Bottom Red Gradient Line */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600"></div>
      </div>
    </div>
  );
};

export default ReportingProduct;