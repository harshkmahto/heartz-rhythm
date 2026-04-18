import React, { useState, useEffect } from 'react';
import { getMe, updateSellerPannel, createSellerPannel } from '../../utils/apiRequest';
import { X, Upload, Eye, EyeOff, Shield, Building, User, CreditCard, MapPin, Image as ImageIcon, Plus, CheckCircle, Clock, UserCircle, Mail, Briefcase } from 'lucide-react';

const UpdateSellerPannel = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [userData, setUserData] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Details (Public)
    brandyName: '',
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
    
    // Seller Details
    sellerName: '',
    
    // Media
    coverImage: null,
    coverImagePreview: '',
    logo: null,
    logoPreview: '',
    previewImages: [],
    previewImagesPreviews: [],
    
    // Personal Details (Private)
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

  const [featuresList, setFeaturesList] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchExistingData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchExistingData = async () => {
    try {
      const userData = await getMe();
      if (userData.data?.sellerPanel) {
        const panel = userData.data.sellerPanel;
        setExistingData(panel);
        setFormData({
          brandyName: panel.brandyName || '',
          brandDescription: panel.brandDescription || '',
          brandCategory: panel.brandCategory || '',
          brandSubCategory: panel.brandSubCategory || '',
          brandPhone: panel.brandPhone || '',
          brandEmail: panel.brandEmail || '',
          brandSpeciality: panel.brandSpeciality || '',
          brandFeatures: panel.brandFeatures || [],
          brandSince: panel.brandSince ? panel.brandSince.split('T')[0] : '',
          companyLocation: panel.companyLocation || '',
          companyAddress: panel.companyAddress || '',
          sellerName: panel.sellerName || '',
          sellerEmail: panel.sellerEmail || '',
          sellerPhone: panel.sellerPhone || '',
          gstNumber: panel.gstNumber || '',
          panNumber: panel.panNumber || '',
          bankName: panel.bankName || '',
          accountNumber: panel.accountNumber || '',
          ifscCode: panel.ifscCode || '',
          bankBranch: panel.bankBranch || '',
          bankUserName: panel.bankUserName || '',
          upi: panel.upi || '',
          pickupLocation: panel.pickupLocation || '',
          pickupAddress: panel.pickupAddress || '',
          coverImagePreview: panel.coverImage || '',
          logoPreview: panel.logo || '',
          previewImagesPreviews: panel.previewImage || []
        });
        setFeaturesList(panel.brandFeatures || []);
      }
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setFormData(prev => ({ ...prev, brandFeatures: [...featuresList, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const updated = featuresList.filter((_, i) => i !== index);
    setFeaturesList(updated);
    setFormData(prev => ({ ...prev, brandFeatures: updated }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (type === 'cover') {
        setFormData(prev => ({ ...prev, coverImage: file, coverImagePreview: preview }));
      } else if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo: file, logoPreview: preview }));
      }
    }
  };

  const handlePreviewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.previewImages.length + files.length > 3) {
      alert('Maximum 3 preview images allowed');
      return;
    }
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      previewImages: [...prev.previewImages, ...files],
      previewImagesPreviews: [...prev.previewImagesPreviews, ...newPreviews]
    }));
  };

  const removePreviewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      previewImages: prev.previewImages.filter((_, i) => i !== index),
      previewImagesPreviews: prev.previewImagesPreviews.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (type, index = null) => {
    if (type === 'cover') {
      setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: '' }));
    } else if (type === 'logo') {
      setFormData(prev => ({ ...prev, logo: null, logoPreview: '' }));
    } else if (type === 'preview' && index !== null) {
      const newImages = [...formData.previewImages];
      const newPreviews = [...formData.previewImagesPreviews];
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        previewImages: newImages,
        previewImagesPreviews: newPreviews
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (!['coverImage', 'logo', 'previewImages', 'coverImagePreview', 'logoPreview', 'previewImagesPreviews'].includes(key)) {
          if (key === 'brandFeatures') {
            submitData.append(key, JSON.stringify(formData[key]));
          } else if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        }
      });
      
      // Append images
      if (formData.coverImage) submitData.append('coverImage', formData.coverImage);
      if (formData.logo) submitData.append('logo', formData.logo);
      formData.previewImages.forEach(img => {
        submitData.append('previewImage', img);
      });
      
      const userResponse = await getMe();
      const userId = userResponse.data?._id;
      
      let response;
      if (existingData) {
        response = await updateSellerPannel(submitData, userId);
      } else {
        response = await createSellerPannel(submitData, userId);
      }
      
      if (response.success) {
        alert(existingData ? 'Seller panel updated successfully!' : 'Seller panel created successfully!');
        fetchExistingData();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Failed to save seller panel');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewData = () => {
    return {
      ...formData,
      brandFeatures: featuresList
    };
  };

  const sections = {
    basic: { title: 'Basic Details', icon: Building, color: 'green', order: 1 },
    media: { title: 'Media', icon: ImageIcon, color: 'blue', order: 2 },
    personal: { title: 'Personal Details', icon: User, color: 'purple', order: 3 },
    preview: { title: 'Preview', icon: Eye, color: 'orange', order: 4 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-7xl h-[90vh] bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 group"
        >
          <X className="text-white group-hover:rotate-90 transition-transform duration-300" size={24} />
        </button>

        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-black/50 to-green-900/50 backdrop-blur-sm border-b border-white/20 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {existingData ? 'Update Your Brand' : 'Create Your Brand'}
              </h1>
              <p className="text-gray-300 mt-1">Complete your seller profile to start selling</p>
            </div>
            
            {userData && (
              <div className="flex items-center gap-4 bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <UserCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-white font-semibold flex items-center gap-2">
                    {userData.name || userData.username || 'User'}
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> Active
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <Mail size={12} /> {userData.email}
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full flex items-center gap-1">
                      <Briefcase size={10} /> Seller
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 p-6 pb-0 border-b border-white/10">
          {Object.entries(sections)
            .sort((a, b) => a[1].order - b[1].order)
            .map(([key, { title, icon: Icon, color }]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSection === key
                    ? `bg-gradient-to-r from-${color}-500 to-emerald-500 text-white shadow-lg`
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {title}
              </button>
            ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="h-[calc(90vh-180px)] overflow-y-auto p-6 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details Section */}
            {activeSection === 'basic' && (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 md:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="text-green-400" size={28} />
                  <h2 className="text-2xl font-bold text-white">Basic Details</h2>
                  <span className="ml-auto text-xs text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Public View</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Brand Name *</label>
                    <input
                      type="text"
                      name="brandyName"
                      value={formData.brandyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 transition-colors"
                      placeholder="Enter your brand name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Brand Since</label>
                    <input
                      type="date"
                      name="brandSince"
                      value={formData.brandSince}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-200 mb-2 font-medium">Brand Description</label>
                    <textarea
                      name="brandDescription"
                      value={formData.brandDescription}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 transition-colors"
                      placeholder="Describe your brand..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Category</label>
                    <input
                      type="text"
                      name="brandCategory"
                      value={formData.brandCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="e.g., Electronics, Fashion"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Sub Category</label>
                    <input
                      type="text"
                      name="brandSubCategory"
                      value={formData.brandSubCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="e.g., Smartphones, Men's Clothing"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Brand Phone</label>
                    <input
                      type="tel"
                      name="brandPhone"
                      value={formData.brandPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="Contact number for customers"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Brand Email</label>
                    <input
                      type="email"
                      name="brandEmail"
                      value={formData.brandEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="customer@brand.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-200 mb-2 font-medium">Brand Speciality</label>
                    <input
                      type="text"
                      name="brandSpeciality"
                      value={formData.brandSpeciality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="What makes your brand unique?"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-200 mb-2 font-medium">Brand Features</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                        placeholder="Add a feature (e.g., Free Shipping)"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {featuresList.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center gap-2">
                          {feature}
                          <button type="button" onClick={() => handleRemoveFeature(idx)} className="hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Company Location</label>
                    <input
                      type="text"
                      name="companyLocation"
                      value={formData.companyLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-200 mb-2 font-medium">Company Address</label>
                    <textarea
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="Full company address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Seller Name *</label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="Your name as seller"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Section */}
            {activeSection === 'media' && (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 md:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="text-blue-400" size={28} />
                  <h2 className="text-2xl font-bold text-white">Media</h2>
                  <span className="ml-auto text-xs text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">Public View</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cover Image */}
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Cover Image</label>
                    <div className="relative">
                      {formData.coverImagePreview ? (
                        <div className="relative group">
                          <img src={formData.coverImagePreview} alt="Cover" className="w-full h-48 object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage('cover')}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-green-400 transition-colors bg-white/5">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-400">Click to upload cover image</p>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {/* Logo */}
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Logo</label>
                    <div className="relative">
                      {formData.logoPreview ? (
                        <div className="relative group w-fit mx-auto">
                          <img src={formData.logoPreview} alt="Logo" className="w-32 h-32 object-cover rounded-full mx-auto" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage('logo')}
                            className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-green-400 transition-colors bg-white/5">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-400">Click to upload logo</p>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview Images */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-200 mb-2 font-medium">Preview Images (Max 3)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.previewImagesPreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-40 object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(idx)}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {formData.previewImagesPreviews.length < 3 && (
                        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-green-400 transition-colors bg-white/5">
                          <div className="flex flex-col items-center justify-center">
                            <Plus className="text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-400">Add image</p>
                          </div>
                          <input type="file" accept="image/*" onChange={handlePreviewImagesChange} className="hidden" multiple />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{formData.previewImagesPreviews.length}/3 images added</p>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Details Section */}
            {activeSection === 'personal' && (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 md:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-purple-400" size={28} />
                  <h2 className="text-2xl font-bold text-white">Personal & Banking Details</h2>
                  <span className="ml-auto text-xs text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <EyeOff size={12} /> Private
                  </span>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                  <p className="text-yellow-300 text-sm flex items-center gap-2">
                    <Shield size={16} />
                    This information is kept private and secure. Only you and platform admins can view these details.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Seller Email *</label>
                    <input
                      type="email"
                      name="sellerEmail"
                      value={formData.sellerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Seller Phone *</label>
                    <input
                      type="tel"
                      name="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-white mb-4">Bank Details</h3>
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Bank Branch</label>
                    <input
                      type="text"
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Account Holder Name</label>
                    <input
                      type="text"
                      name="bankUserName"
                      value={formData.bankUserName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">UPI ID</label>
                    <input
                      type="text"
                      name="upi"
                      value={formData.upi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="example@upi"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-white mb-4">Pickup Location</h3>
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">Pickup Location Name</label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="Warehouse, Store Name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-200 mb-2 font-medium">Pickup Address</label>
                    <textarea
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                      placeholder="Complete pickup address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preview Section */}
            {activeSection === 'preview' && (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 md:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="text-orange-400" size={28} />
                  <h2 className="text-2xl font-bold text-white">Preview - Public View</h2>
                  <span className="ml-auto text-xs text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full">How customers will see</span>
                </div>

                <div className="space-y-6">
                  {/* Brand Header */}
                  <div className="text-center border-b border-white/20 pb-6">
                    {formData.logoPreview && (
                      <img src={formData.logoPreview} alt="Logo" className="w-24 h-24 object-cover rounded-full mx-auto mb-4" />
                    )}
                    <h3 className="text-3xl font-bold text-white">{formData.brandyName || 'Brand Name'}</h3>
                    {formData.brandSince && (
                      <p className="text-gray-400 mt-1">Since {formData.brandSince}</p>
                    )}
                  </div>

                  {/* Cover Image */}
                  {formData.coverImagePreview && (
                    <div>
                      <img src={formData.coverImagePreview} alt="Cover" className="w-full h-64 object-cover rounded-xl" />
                    </div>
                  )}

                  {/* Preview Images */}
                  {formData.previewImagesPreviews.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Gallery</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.previewImagesPreviews.map((preview, idx) => (
                          <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-full h-48 object-cover rounded-xl" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand Description */}
                  {formData.brandDescription && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">About Brand</h4>
                      <p className="text-gray-300">{formData.brandDescription}</p>
                    </div>
                  )}

                  {/* Brand Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.brandCategory && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="text-white font-medium">{formData.brandCategory}</p>
                      </div>
                    )}
                    {formData.brandSubCategory && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Sub Category</p>
                        <p className="text-white font-medium">{formData.brandSubCategory}</p>
                      </div>
                    )}
                    {formData.brandPhone && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Contact Number</p>
                        <p className="text-white font-medium">{formData.brandPhone}</p>
                      </div>
                    )}
                    {formData.brandEmail && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white font-medium">{formData.brandEmail}</p>
                      </div>
                    )}
                    {formData.brandSpeciality && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Speciality</p>
                        <p className="text-white font-medium">{formData.brandSpeciality}</p>
                      </div>
                    )}
                    {formData.companyLocation && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">{formData.companyLocation}</p>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {featuresList.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {featuresList.map((feature, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Address */}
                  {formData.companyAddress && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Company Address</h4>
                      <p className="text-gray-300">{formData.companyAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button - Only show on non-preview sections */}
            {activeSection !== 'preview' && (
              <div className="flex gap-4 justify-end sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-green-500/30 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : existingData ? 'Update Panel' : 'Create Panel'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.8);
        }
      `}</style>
    </div>
  );
};

export default UpdateSellerPannel;