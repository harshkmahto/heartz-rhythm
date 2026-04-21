import React, { useState, useEffect } from 'react';
import { 
  X, Package, Star, Clock, RefreshCw, Truck,
  Plus, Send, Edit3, ArrowRight
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateProduct } from '../../../utils/product.apiRequest';
import { ALLOWED_CATEGORIES } from '../../../Helper/Categories';
import { useNavigate } from 'react-router-dom';

const UpdateProducts = ({ product, productId, onClose, onRefresh }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  
  // Form state - removed variants, about, seo, discount (keep only essential)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    features: [],
    category: '',
    subCategory: '',
    brand: '',
    replacement: { isAvailable: false, duration: '', policy: '' },
    return: { isAvailable: false, duration: '', policy: '' },
    status: 'draft',
    isFeatured: false,
    isComingSoon: false,
  });

  // Temporary states for UI
  const [featureInput, setFeatureInput] = useState('');

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        subtitle: product.subtitle || '',
        description: product.description || '',
        features: product.features || [],
        category: product.category || '',
        subCategory: product.subCategory || '',
        brand: product.brand || '',
        replacement: product.replacement || { isAvailable: false, duration: '', policy: '' },
        return: product.return || { isAvailable: false, duration: '', policy: '' },
        status: product.status || 'draft',
        isFeatured: product.isFeatured || false,
        isComingSoon: product.isComingSoon || false,
      });
      
      if (product.scheduledAt) {
        setSelectedDateTime(new Date(product.scheduledAt));
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = new FormData();
    const productData = { ...formData };
    
    submitData.append('productData', JSON.stringify(productData));
    
    if (formData.status === 'scheduled' && selectedDateTime) {
      submitData.append('scheduledAt', selectedDateTime.toISOString());
    }
    
    try {
      const response = await updateProduct(productId, submitData);
      if (response.success) {
        alert('Product updated successfully!');
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMore = () => {
    onClose();
    navigate(`/seller/product/update/${productId}`);
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? 'bg-green-600' : 'bg-gray-600'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden border border-green-200 dark:border-green-800">
      {/* Header with Green Gradient */}
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="flex justify-between items-center p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Edit3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-green-900 dark:text-green-100">Quick Update</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>
        </div>
        <p className="text-xs text-green-600 dark:text-green-400 px-5 pb-2 -mt-2">
          Update basic information quickly. For variants, images, SEO, use "Update More Details"
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                placeholder="Enter product title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Product Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                placeholder="Enter product subtitle"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
              placeholder="Enter detailed product description"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Product Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                className="flex-1 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                placeholder="Enter a feature"
              />
              <button type="button" onClick={addFeature} className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 cursor-pointer">
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 rounded-full text-sm">
                  {feature}
                  <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-500 cursor-pointer"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black"
              >
                <option value="">Select Category</option>
                {ALLOWED_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                disabled
                className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Replacement & Return Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Replacement */}
            <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                  <RefreshCw size={16} /> Replacement
                </label>
                <ToggleSwitch 
                  enabled={formData.replacement.isAvailable} 
                  onChange={(val) => handleNestedChange('replacement', 'isAvailable', val)} 
                />
              </div>
              {formData.replacement.isAvailable && (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Duration (days)"
                    value={formData.replacement.duration}
                    onChange={(e) => handleNestedChange('replacement', 'duration', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <textarea
                    placeholder="Policy details"
                    value={formData.replacement.policy}
                    onChange={(e) => handleNestedChange('replacement', 'policy', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                </div>
              )}
            </div>

            {/* Return */}
            <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Truck size={16} /> Return
                </label>
                <ToggleSwitch 
                  enabled={formData.return.isAvailable} 
                  onChange={(val) => handleNestedChange('return', 'isAvailable', val)} 
                />
              </div>
              {formData.return.isAvailable && (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Duration (days)"
                    value={formData.return.duration}
                    onChange={(e) => handleNestedChange('return', 'duration', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <textarea
                    placeholder="Policy details"
                    value={formData.return.policy}
                    onChange={(e) => handleNestedChange('return', 'policy', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Featured & Coming Soon Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-green-200 dark:border-green-700 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                <Star size={16} /> Featured Product
              </span>
              <ToggleSwitch enabled={formData.isFeatured} onChange={(val) => setFormData(prev => ({ ...prev, isFeatured: val }))} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                <Clock size={16} /> Coming Soon
              </span>
              <ToggleSwitch enabled={formData.isComingSoon} onChange={(val) => setFormData(prev => ({ ...prev, isComingSoon: val }))} />
            </div>
          </div>

          {/* Status */}
          <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
            <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-3">Status</label>
            <div className="flex flex-wrap gap-4">
              {['draft', 'active', 'scheduled'].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={handleInputChange}
                    className="text-green-600 w-4 h-4"
                  />
                  <span className="text-green-800 dark:text-green-300 capitalize">{status}</span>
                </label>
              ))}
            </div>
            {formData.status === 'scheduled' && (
              <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-700">
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Schedule Date & Time</label>
                <DatePicker
                  selected={selectedDateTime}
                  onChange={(date) => setSelectedDateTime(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  placeholderText="Select date and time"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-green-200 dark:border-green-800">
            <button
              type="button"
              onClick={handleUpdateMore}
              className="flex-1 px-4 py-2.5 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 size={16} />
              Update More Details
              <ArrowRight size={14} />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
              ) : (
                <><Send size={16} /> Update Product</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Green Border */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
    </div>
  );
};

export default UpdateProducts;