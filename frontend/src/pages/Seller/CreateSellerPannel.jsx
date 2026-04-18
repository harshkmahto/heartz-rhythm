import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Save, Building, MapPin, Phone, Mail, 
  Award, Calendar, User, Hash, Loader2, 
  CheckCircle, Plus, Trash2, Globe, Lock, 
  Image, Upload, Banknote, CreditCard, Truck,
  Briefcase, Eye, EyeOff, AlertCircle, Shield
} from 'lucide-react';
import { createSellerPannel } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';
import { useSeller } from '../../context/SellerContext';

const CreateSellerPannel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSellerExists } = useSeller();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info (Public)
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
    sellerName: '',
    
    // Personal Info (Private)
    
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
    pickupAddress: '',
    
    // Media Files
    coverImage: null,
    logo: null,
    previewImages: []
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [featuresList, setFeaturesList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [type]: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (type === 'coverImage') {
        setCoverPreview(previewUrl);
      } else if (type === 'logo') {
        setLogoPreview(previewUrl);
      }
    }
  };

  const handlePreviewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = Math.min(files.length, 3);
    const selectedFiles = files.slice(0, maxFiles);
    
    setFormData(prev => ({ ...prev, previewImages: selectedFiles }));
    
    // Create preview URLs
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
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
        throw new Error('User ID is missing');
      }
      
      const submitData = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        if (key === 'brandFeatures') {
          submitData.append(key, JSON.stringify(featuresList));
             featuresList.forEach((feature, index) => {
          submitData.append(`brandFeatures[${index}]`, feature);
        });
      } 
         else if (key === 'previewImages') {
          formData.previewImages.forEach((file, index) => {
            submitData.append(`previewImage`, file);
          });
        } else if (key === 'coverImage' && formData.coverImage) {
          submitData.append('coverImage', formData.coverImage);
        } else if (key === 'logo' && formData.logo) {
          submitData.append('logo', formData.logo);
        } else if (typeof formData[key] !== 'object') {
          submitData.append(key, formData[key]);
        }
      });
      
      const response = await createSellerPannel(submitData, userId);
      
      if (response.success) {
        alert('Seller panel created successfully!');
        navigate('/seller/seller-details');
      } else {
        alert(response.message || 'Failed to create seller panel');
      }
    } catch (error) {
      console.error('Error creating seller panel:', error);
      alert(error.message || 'Failed to create seller panel');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basic', name: 'Basic Information', icon: Globe, color: 'emerald', badge: 'Public' },
    { id: 'media', name: 'Media & Images', icon: Image, color: 'blue', badge: 'Public' },
    { id: 'personal', name: 'Personal Details', icon: Lock, color: 'purple', badge: 'Private' }
  ];


  if(isSellerExists){
    return(
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:bg-gradient-to-br dark:from-green-950 dark:via-black dark:to-emerald-800">
        <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-2xl max-w-md">
          <div className="text-yellow-600 text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">Seller Profile Already Created</h3>
          <p className="text-yellow-600 dark:text-yellow-300 mb-4">You Can View or Update</p>
          <Link
            to="/seller/seller-details" 
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-950 dark:via-black dark:to-emerald-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl mb-4">
            <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
            Create Seller Panel
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Set up your brand profile to start selling on Heartz Rhythm
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
                ${activeSection === section.id 
                  ? `bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-105` 
                  : 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer'
                }
              `}
            >
              <section.icon className="w-4 h-4" />
              {section.name}
              <span className={`
                text-xs px-2 py-0.5 rounded-full ml-2
                ${activeSection === section.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }
              `}>
                {section.badge}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section - Public */}
          {activeSection === 'basic' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-400">Public Information</p>
                    <p className="text-sm text-amber-700 dark:text-amber-500">This information will be visible to all customers visiting your brand page.</p>
                  </div>
                </div>
              </div>

              {/* Brand Name */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                    placeholder="Enter your brand name"
                  />
                </div>
              </div>

              {/* Brand Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Brand Description
                </label>
                <textarea
                  name="brandDescription"
                  value={formData.brandDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all resize-none"
                  placeholder="Describe your brand, its mission, and what makes it unique..."
                />
              </div>

              {/* Category & Sub Category */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="brandCategory"
                      value={formData.brandCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="e.g., Electronics, Fashion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      name="brandSubCategory"
                      value={formData.brandSubCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="e.g., Smartphones, Men's Clothing"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Brand Phone
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="tel"
                        name="brandPhone"
                        value={formData.brandPhone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="Customer support number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Brand Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="email"
                        name="brandEmail"
                        value={formData.brandEmail}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="contact@brand.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Speciality */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Brand Speciality
                </label>
                <div className="relative group">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="brandSpeciality"
                    value={formData.brandSpeciality}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                    placeholder="What makes your brand unique?"
                  />
                </div>
              </div>

              {/* Brand Features */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Brand Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    className="flex-1 px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                    placeholder="Add a feature (e.g., Free Shipping)"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all font-medium shadow-md"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featuresList.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm flex items-center gap-2">
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

              {/* Brand Since & Location */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Brand Since
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="date"
                        name="brandSince"
                        value={formData.brandSince}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Company Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="text"
                        name="companyLocation"
                        value={formData.companyLocation}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Address */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Address
                </label>
                <textarea
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all resize-none"
                  placeholder="Full company address"
                />
              </div>

              {/* Seller Information */}
               <div className='bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6'>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Seller Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="Your full name"
                    />
                  </div>
            </div>
          )}



          {/* Media Section */}
          {activeSection === 'media' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-400">Media Files (Public)</p>
                    <p className="text-sm text-blue-700 dark:text-blue-500">Upload your brand images to make your storefront attractive.</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image
                </label>
                <div className="relative">
                  {coverPreview ? (
                    <div className="relative group">
                      <img src={coverPreview} alt="Cover preview" className="w-full h-48 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview(null);
                          setFormData(prev => ({ ...prev, coverImage: null }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                      <Upload className="w-8 h-8 text-emerald-500 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload cover image</p>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'coverImage')} />
                    </label>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Brand Logo
                </label>
                <div className="relative">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-contain rounded-xl bg-white p-2 border" />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setFormData(prev => ({ ...prev, logo: null }));
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                      <Upload className="w-6 h-6 text-emerald-500 mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Logo</p>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
                    </label>
                  )}
                </div>
              </div>

              {/* Preview Images */}
              <div className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gallery Images (Max 3)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = previewUrls.filter((_, i) => i !== idx);
                          const newFiles = formData.previewImages.filter((_, i) => i !== idx);
                          setPreviewUrls(newUrls);
                          setFormData(prev => ({ ...prev, previewImages: newFiles }));
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {previewUrls.length < 3 && (
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                      <Plus size={20} className="text-emerald-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Add</p>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePreviewImagesChange} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">Upload up to 3 images (JPG, PNG, WEBP)</p>
              </div>
            </div>
          )}

          {/* Personal Information Section - Private */}
          {activeSection === 'personal' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-800 dark:text-purple-400">Private Information</p>
                    <p className="text-sm text-purple-700 dark:text-purple-500">This information is confidential and only visible to you and platform admins.</p>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Seller Information <span className="text-red-500">*</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Seller Email
                    </label>
                    <input
                      type="email"
                      name="sellerEmail"
                      value={formData.sellerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="seller@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Seller Phone
                    </label>
                    <input
                      type="tel"
                      name="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="Your contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-emerald-600" />
                  Tax Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="22AAAAA0000A1Z"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      PAN Number 
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  Banking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="State Bank of India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="Your account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="SBIN0001234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Bank Branch
                    </label>
                    <input
                      type="text"
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="Branch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="bankUserName"
                      value={formData.bankUserName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="Name on account"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upi"
                      value={formData.upi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="username@bankname"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  Pickup Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="City, State for pickup"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Pickup Address
                    </label>
                    <textarea
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all resize-none"
                      placeholder="Complete pickup address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="sticky bottom-0 mt-8 -mx-4 px-4 py-4 bg-white/10 backdrop-blur-md border-t border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-lg">
            <div className="flex gap-3 max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => navigate('/seller')}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-900 transition-all font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Seller Panel
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateSellerPannel;