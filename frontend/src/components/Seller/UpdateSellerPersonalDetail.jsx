import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Phone, Mail, CreditCard, 
  Building, MapPin, Truck, Shield, EyeOff,
  Lock, Banknote, Hash, Loader2, CheckCircle,
  AlertCircle, TrendingUp, Award
} from 'lucide-react';
import { updatePersonalDetails } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';
import { useSeller } from '../../context/SellerContext';

const UpdateSellerPersonalDetail = ({ onClose }) => {
  const { user } = useAuth();
  const { seller } = useSeller();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sellerEmail: '',
    sellerPhone: '',
    gstNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranch: '',
    bankUserName: '',
    upi: '',
    pickupLocation: '',
    pickupAddress: ''
  });

  // Load current data from seller context
  useEffect(() => {
    if (seller) {
      setFormData({
        sellerEmail: seller.sellerEmail || '',
        sellerPhone: seller.sellerPhone || '',
        gstNumber: seller.gstNumber || '',
        panNumber: seller.panNumber || '',
        bankName: seller.bankName || '',
        accountNumber: seller.accountNumber || '',
        ifscCode: seller.ifscCode || '',
        bankBranch: seller.bankBranch || '',
        bankUserName: seller.bankUserName || '',
        upi: seller.upi || '',
        pickupLocation: seller.pickupLocation || '',
        pickupAddress: seller.pickupAddress || ''
      });
    }
  }, [seller]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      const response = await updatePersonalDetails(formData, userId);
      
      if (response.success) {
        alert('Personal details updated successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error updating personal details:', error);
      alert(error.message || 'Failed to update personal details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-green-950 dark:via-black dark:to-emerald-800 rounded-2xl overflow-hidden shadow-2xl border border-emerald-200/50 dark:border-emerald-800/30">
      
      {/* Top Green Panel */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-green-600 to-emerald-600"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-emerald-200/50 dark:border-emerald-800/30 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="text-emerald-600 dark:text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  Update Personal Details
                </h2>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Manage your private information (only visible to you and admins)
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

        {/* Privacy Warning */}
        <div className="mx-6 mt-6 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <Shield className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div>
              <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm flex items-center gap-2">
                <Lock size={14} /> Private & Secure Information
              </p>
              <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                This information is kept private and secure. Only you and platform administrators can view these details.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto custom-scrollbar">
          
          {/* Contact Information Card */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <User size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                Contact Information
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Seller Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="email"
                      name="sellerEmail"
                      value={formData.sellerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                      placeholder="seller@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Seller Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="tel"
                      name="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                      placeholder="Contact number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Information Card */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <Hash size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                Tax Information
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white uppercase transition-all duration-300 hover:border-emerald-400"
                    placeholder="22AAAAA0000A1Z"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white uppercase transition-all duration-300 hover:border-emerald-400"
                    placeholder="AAAAA0000A"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <Banknote size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                Bank Details
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Bank Name
                  </label>
                  <div className="relative group">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                      placeholder="State Bank of India"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Account Number
                  </label>
                  <div className="relative group">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                      placeholder="Your bank account number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white uppercase transition-all duration-300 hover:border-emerald-400"
                    placeholder="SBIN0001234"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Bank Branch
                  </label>
                  <input
                    type="text"
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                    placeholder="Branch name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="bankUserName"
                    value={formData.bankUserName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                    placeholder="Name as in bank account"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upi"
                    value={formData.upi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                    placeholder="username@upi"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Location Card */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <Truck size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                Pickup Location
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Pickup Location Name
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-300 hover:border-emerald-400"
                      placeholder="Warehouse, Store Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Pickup Address
                  </label>
                  <textarea
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white resize-none transition-all duration-300 hover:border-emerald-400"
                    placeholder="Complete address for product pickup"
                  />
                </div>
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

export default UpdateSellerPersonalDetail;