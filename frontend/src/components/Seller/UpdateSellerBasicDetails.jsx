import React, { useState, useEffect } from 'react';
import { 
  X, Save, Building, MapPin, Phone, Mail, 
  Award, Calendar, User, Hash, Loader2, 
  CheckCircle, Plus, Trash2
} from 'lucide-react';
import { updateBasicDetails } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';
import { useSeller } from '../../context/SellerContext';

const UpdateSellerBasicDetails = ({ onClose }) => {
  const { user } = useAuth();
  const { seller } = useSeller();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    brandDescription: '',
    brandCategory: '',
    brandSubCategory: '',
    brandPhone: '',
    brandEmail: '',
    brandSpeciality: '',
    brandFeatures: [],
    brandSince: '',
    companyLocation: '',
    companyAddress: '',
    sellerName: ''
  });
  const [newFeature, setNewFeature] = useState('');
  const [featuresList, setFeaturesList] = useState([]);

  // Load current data from seller context
  useEffect(() => {
    if (seller) {
      // Format brandSince for date input (YYYY-MM-DD)
      let formattedDate = '';
      if (seller.brandSince) {
        const date = new Date(seller.brandSince);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      }
      
      setFormData({
        brandName: seller.brandName || '',
        brandDescription: seller.brandDescription || '',
        brandCategory: seller.brandCategory || '',
        brandSubCategory: seller.brandSubCategory || '',
        brandPhone: seller.brandPhone || '',
        brandEmail: seller.brandEmail || '',
        brandSpeciality: seller.brandSpeciality || '',
        brandFeatures: seller.brandFeatures || [],
        brandSince: formattedDate,
        companyLocation: seller.companyLocation || '',
        companyAddress: seller.companyAddress || '',
        sellerName: seller.sellerName || ''
      });
      setFeaturesList(seller.brandFeatures || []);
    }
  }, [seller]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...featuresList, newFeature.trim()];
      setFeaturesList(updatedFeatures);
      setFormData(prev => ({ ...prev, brandFeatures: updatedFeatures }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = featuresList.filter((_, i) => i !== index);
    setFeaturesList(updatedFeatures);
    setFormData(prev => ({ ...prev, brandFeatures: updatedFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('User ID is missing from auth context');
      }
      
      const submitData = {
        ...formData,
        brandFeatures: JSON.stringify(featuresList)
      };
      
      const response = await updateBasicDetails(submitData, userId);
      
      if (response.success) {
        alert('Basic details updated successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error updating basic details:', error);
      alert(error.message || 'Failed to update basic details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-green-950 dark:via-black dark:to-emerald-800 rounded-2xl overflow-hidden shadow-2xl border border-emerald-200/50 dark:border-emerald-800/30">
      
      {/* Top Green Panel */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-green-600 to-emerald-600"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-emerald-200/50 dark:border-emerald-800/30 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building className="text-emerald-600 dark:text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  Update Basic Details
                </h2>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Manage your brand information that customers will see
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-300 hover:scale-110"
            >
              <X size={24} className="text-red-500 dark:text-red-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
          
          {/* Brand Name */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  placeholder="Enter your brand name"
                />
              </div>
            </div>
          </div>

          {/* Brand Description */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Brand Description
              </label>
              <textarea
                name="brandDescription"
                value={formData.brandDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400 resize-none"
                placeholder="Describe your brand, its mission, and what makes it unique..."
              />
            </div>
          </div>

          {/* Category & Sub Category */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Category
                </label>
                <input
                  type="text"
                  name="brandCategory"
                  value={formData.brandCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  placeholder="e.g., Electronics, Fashion"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="brandSubCategory"
                  value={formData.brandSubCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  placeholder="e.g., Smartphones, Men's Clothing"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Brand Phone
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    name="brandPhone"
                    value={formData.brandPhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                    placeholder="Customer support number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Brand Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="email"
                    name="brandEmail"
                    value={formData.brandEmail}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                    placeholder="contact@brand.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Speciality */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Brand Speciality
              </label>
              <div className="relative group">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="brandSpeciality"
                  value={formData.brandSpeciality}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  placeholder="What makes your brand unique?"
                />
              </div>
            </div>
          </div>

          {/* Brand Features */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Brand Features
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  className="flex-1 px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  placeholder="Add a feature (e.g., Free Shipping)"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {featuresList.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle size={14} />
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Since & Location */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Brand Since
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="date"
                    name="brandSince"
                    value={formData.brandSince}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Company Location
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Address */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Company Address
              </label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400 resize-none"
                placeholder="Full company address"
              />
            </div>
          </div>

          {/* Seller Name */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl p-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Seller Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                  placeholder="Your name as seller"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700 backdrop-blur-md border-t border-emerald-400/30 shadow-lg rounded-b-2xl">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium border border-white/30 hover:scale-105 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.8);
        }
      `}</style>
    </div>
  );
};

export default UpdateSellerBasicDetails;