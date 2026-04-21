import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, Image, Settings, SearchCode, Eye, Send, Plus, X, Upload, Check,
  ChevronRight, Trash2, Calendar as CalendarIcon, Star, Video, Image as ImageIcon,
  AlertCircle, RefreshCw, Palette, Info, FileText, Globe, DollarSign, Percent,
  Truck, Zap, Edit3, Save, Loader
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMySingleProduct, updateProduct } from '../../utils/product.apiRequest';
import { ALLOWED_CATEGORIES } from '../../Helper/Categories';

const SellerUpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    features: [],
    category: '',
    subCategory: '',
    brand: '',
    about: [],
    variants: [],
    thumbnail: null,
    images: [],
    gallery: [],
    preview: null,
    videos: [],
    showCase: [],
    discount: { type: 'percentage', value: 0, code: '' },
    replacement: { isAvailable: false, duration: '', policy: '' },
    return: { isAvailable: false, duration: '', policy: '' },
    status: 'draft',
    isFeatured: false,
    isComingSoon: false,
    seo: { title: '', description: '', keywords: [] }
  });

  // Existing images/videos URLs (to display)
  const [existingImages, setExistingImages] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingShowcase, setExistingShowcase] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState(null);
  const [existingPreview, setExistingPreview] = useState(null);

  // Temporary states
  const [featureInput, setFeatureInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [aboutInput, setAboutInput] = useState({ key: '', value: '' });
  const [showCaseInput, setShowCaseInput] = useState({ key: '', value: '', image: null });
  const [showCaseImagePreview, setShowCaseImagePreview] = useState(null);
  const [variantInput, setVariantInput] = useState({
    name: '', colorCode: '#10b981', basePrice: '', mrp: '', stock: '', isAvailable: true
  });

  const tabs = [
    { id: 'basic', label: 'Basic Details', icon: Package },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'variants', label: 'Variants', icon: Palette },
    { id: 'details', label: 'Pricing & Policies', icon: Settings },
    { id: 'seo', label: 'SEO', icon: SearchCode },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getMySingleProduct(productId);
      if (response.success) {
        const product = response.data;
        setFormData({
          title: product.title || '',
          subtitle: product.subtitle || '',
          description: product.description || '',
          features: product.features || [],
          category: product.category || '',
          subCategory: product.subCategory || '',
          brand: product.brand || '',
          about: product.about || [],
          variants: product.variants || [],
          discount: product.discount || { type: 'percentage', value: 0, code: '' },
          replacement: product.replacement || { isAvailable: false, duration: '', policy: '' },
          return: product.return || { isAvailable: false, duration: '', policy: '' },
          status: product.status || 'draft',
          isFeatured: product.isFeatured || false,
          isComingSoon: product.isComingSoon || false,
          seo: product.seo || { title: '', description: '', keywords: [] }
        });
        
        setExistingImages(product.images || []);
        setExistingGallery(product.gallery || []);
        setExistingVideos(product.videos || []);
        setExistingShowcase(product.showCase || []);
        setExistingThumbnail(product.thumbnail || null);
        setExistingPreview(product.preview || null);
        
        if (product.scheduledAt) {
          setSelectedDateTime(new Date(product.scheduledAt));
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        seo: { ...prev.seo, keywords: [...prev.seo.keywords, keywordInput.trim()] }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      seo: { ...prev.seo, keywords: prev.seo.keywords.filter((_, i) => i !== index) }
    }));
  };

  const addAbout = () => {
    if (aboutInput.key.trim() && aboutInput.value.trim()) {
      setFormData(prev => ({ ...prev, about: [...prev.about, { ...aboutInput }] }));
      setAboutInput({ key: '', value: '' });
    }
  };

  const removeAbout = (index) => {
    setFormData(prev => ({ ...prev, about: prev.about.filter((_, i) => i !== index) }));
  };

  const addVariant = () => {
    if (variantInput.name && variantInput.basePrice && variantInput.mrp && variantInput.stock) {
      const basePriceNum = parseFloat(variantInput.basePrice);
      const mrpNum = parseFloat(variantInput.mrp);
      
      if (mrpNum < basePriceNum) {
        alert('MRP must be greater than or equal to Base Price');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { 
          ...variantInput, 
          basePrice: basePriceNum,
          mrp: mrpNum,
          stock: parseInt(variantInput.stock)
        }]
      }));
      setVariantInput({ name: '', colorCode: '#10b981', basePrice: '', mrp: '', stock: '', isAvailable: true });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const updateVariantAvailability = (index, isAvailable) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, isAvailable } : v)
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'thumbnail' || type === 'preview') {
      setFormData(prev => ({ ...prev, [type]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [type]: [...(prev[type] || []), ...files] }));
    }
  };

  const removeExistingMedia = (type, index) => {
    if (type === 'images') {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'gallery') {
      setExistingGallery(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'videos') {
      setExistingVideos(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'showcase') {
      setExistingShowcase(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeNewMedia = (type, index) => {
    setFormData(prev => ({ 
      ...prev, 
      [type]: (prev[type] || []).filter((_, i) => i !== index) 
    }));
  };

  const handleShowCaseImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowCaseImagePreview(URL.createObjectURL(file));
      setShowCaseInput(prev => ({ ...prev, image: file }));
    }
  };

  const addShowCase = () => {
    if (showCaseInput.key.trim() && showCaseInput.value.trim() && showCaseInput.image) {
      setFormData(prev => ({
        ...prev,
        showCase: [...(prev.showCase || []), { ...showCaseInput, imagePreview: showCaseImagePreview }]
      }));
      setShowCaseInput({ key: '', value: '', image: null });
      setShowCaseImagePreview(null);
    }
  };

  const removeShowCase = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      showCase: (prev.showCase || []).filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const submitData = new FormData();
    const productData = { ...formData };
    
    // Remove file objects
    delete productData.thumbnail;
    delete productData.preview;
    delete productData.images;
    delete productData.gallery;
    delete productData.videos;
    delete productData.showCase;
    
    // Add existing media URLs (only if they exist)
    if (existingImages.length) productData.existingImages = existingImages;
    if (existingGallery.length) productData.existingGallery = existingGallery;
    if (existingVideos.length) productData.existingVideos = existingVideos;
    if (existingShowcase.length) productData.existingShowcase = existingShowcase;
    if (existingThumbnail) productData.existingThumbnail = existingThumbnail;
    if (existingPreview) productData.existingPreview = existingPreview;
    
    submitData.append('productData', JSON.stringify(productData));
    
    // Append new files (with null checks)
    if (formData.thumbnail) submitData.append('thumbnail', formData.thumbnail);
    if (formData.preview) submitData.append('preview', formData.preview);
    
    if (formData.images && formData.images.length) {
      formData.images.forEach(img => submitData.append('images', img));
    }
    if (formData.gallery && formData.gallery.length) {
      formData.gallery.forEach(img => submitData.append('gallery', img));
    }
    if (formData.videos && formData.videos.length) {
      formData.videos.forEach(video => submitData.append('videos', video));
    }
    
    if (formData.showCase && formData.showCase.length) {
      formData.showCase.forEach((item, idx) => {
        if (item.image) submitData.append(`showCase_${idx}`, item.image);
      });
    }
    
    if (formData.status === 'scheduled' && selectedDateTime) {
      submitData.append('scheduledAt', selectedDateTime.toISOString());
    }
    
    try {
      const response = await updateProduct(productId, submitData);
      if (response.success) {
        alert('Product updated successfully!');
        navigate(`/seller/product/details/${productId}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black flex items-center justify-center">
        <Loader className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={`/seller/product/details/${productId}`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/40 rounded-xl border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 cursor-pointer">
              <ArrowLeft size={18} />
              Back to Product
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            Update Product
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-green-200 dark:border-green-800 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                    : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-green-200 dark:border-green-800">
          
          {/* Basic Details Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="Enter product title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="Enter subtitle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  placeholder="Enter detailed description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Features</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="Enter a feature"
                  />
                  <button type="button" onClick={addFeature} className="px-4 py-2.5 bg-green-600 text-white rounded-xl">
                    <Plus size={18} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 rounded-full text-sm">
                      <Check size={14} /> {feature}
                      <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-500"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Category <span className="text-red-500">*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  >
                    <option value="">Select Category</option>
                    {ALLOWED_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Sub Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="Enter subcategory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">About (Key-Value Pairs)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Key"
                    value={aboutInput.key}
                    onChange={(e) => setAboutInput(prev => ({ ...prev, key: e.target.value }))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={aboutInput.value}
                    onChange={(e) => setAboutInput(prev => ({ ...prev, value: e.target.value }))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <button type="button" onClick={addAbout} className="px-4 py-2.5 bg-green-600 text-white rounded-xl"><Plus size={18} /></button>
                </div>
                <div className="space-y-2">
                  {formData.about.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <span className="font-medium text-green-800 dark:text-green-300">{item.key}:</span>
                      <span className="text-green-700 dark:text-green-400">{item.value}</span>
                      <button type="button" onClick={() => removeAbout(idx)} className="text-red-500"><X size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Thumbnail</label>
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 text-center bg-white dark:bg-black/20">
                  {existingThumbnail && !formData.thumbnail && (
                    <div className="relative inline-block mb-4">
                      <img src={existingThumbnail} alt="Current Thumbnail" className="w-32 h-32 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => setExistingThumbnail(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {formData.thumbnail ? (
                    <div className="relative inline-block">
                      <img src={URL.createObjectURL(formData.thumbnail)} alt="New Thumbnail" className="w-32 h-32 object-cover rounded-xl" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={40} className="text-green-500" />
                      <span>Upload new thumbnail</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'thumbnail')} />
                    </label>
                  )}
                </div>
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Product Images</label>
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 bg-white dark:bg-black/20">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {(existingImages || []).map((img, idx) => (
                      <div key={`existing-${idx}`} className="relative">
                        <img src={img} alt={`Existing ${idx}`} className="w-24 h-24 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeExistingMedia('images', idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                      </div>
                    ))}
                    {(formData.images || []).map((img, idx) => (
                      <div key={`new-${idx}`} className="relative">
                        <img src={URL.createObjectURL(img)} alt={`New ${idx}`} className="w-24 h-24 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeNewMedia('images', idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer flex items-center justify-center gap-2 text-green-600">
                    <Plus size={20} /> Add images
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'images')} />
                  </label>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Gallery Images</label>
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 bg-white dark:bg-black/20">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {(existingGallery || []).map((img, idx) => (
                      <div key={`existing-${idx}`} className="relative">
                        <img src={img} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeExistingMedia('gallery', idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                      </div>
                    ))}
                    {(formData.gallery || []).map((img, idx) => (
                      <div key={`new-${idx}`} className="relative">
                        <img src={URL.createObjectURL(img)} alt={`New Gallery ${idx}`} className="w-24 h-24 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeNewMedia('gallery', idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer flex items-center justify-center gap-2 text-green-600">
                    <Plus size={20} /> Add to gallery
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'gallery')} />
                  </label>
                </div>
              </div>

              {/* Videos */}
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Videos</label>
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 bg-white dark:bg-black/20">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {(existingVideos || []).map((video, idx) => (
                      <div key={`existing-${idx}`} className="relative">
                        <video src={video} className="w-32 h-32 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeExistingMedia('videos', idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                      </div>
                    ))}
                    {(formData.videos || []).map((video, idx) => (
                      <div key={`new-${idx}`} className="relative">
                        <video src={URL.createObjectURL(video)} className="w-32 h-32 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeNewMedia('videos', idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer flex items-center justify-center gap-2 text-green-600">
                    <Plus size={20} /> Add videos
                    <input type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'videos')} />
                  </label>
                </div>
              </div>

              {/* Showcase */}
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Showcase Items</label>
                <div className="space-y-4 p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
                  <div className="flex gap-3 flex-wrap">
                    <label className="cursor-pointer flex flex-col items-center gap-1 p-2 border rounded-lg">
                      {showCaseImagePreview ? (
                        <img src={showCaseImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <ImageIcon size={32} className="text-green-500" />
                      )}
                      <span className="text-xs">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleShowCaseImageChange} />
                    </label>
                    <input
                      type="text"
                      placeholder="Key"
                      value={showCaseInput.key}
                      onChange={(e) => setShowCaseInput(prev => ({ ...prev, key: e.target.value }))}
                      className="flex-1 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={showCaseInput.value}
                      onChange={(e) => setShowCaseInput(prev => ({ ...prev, value: e.target.value }))}
                      className="flex-1 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    />
                    <button type="button" onClick={addShowCase} className="px-4 py-2 bg-green-600 text-white rounded-xl"><Plus size={18} /></button>
                  </div>
                  <div className="space-y-2">
                    {(existingShowcase || []).map((item, idx) => (
                      <div key={`existing-${idx}`} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        {item.image && <img src={item.image} alt="Showcase" className="w-12 h-12 object-cover rounded-lg" />}
                        <span className="font-medium">{item.key}:</span>
                        <span>{item.value}</span>
                        <button type="button" onClick={() => removeExistingMedia('showcase', idx)} className="ml-auto text-red-500"><X size={18} /></button>
                      </div>
                    ))}
                    {(formData.showCase || []).map((item, idx) => (
                      <div key={`new-${idx}`} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        {item.imagePreview && <img src={item.imagePreview} alt="Showcase" className="w-12 h-12 object-cover rounded-lg" />}
                        <span className="font-medium">{item.key}:</span>
                        <span>{item.value}</span>
                        <button type="button" onClick={() => removeShowCase(idx)} className="ml-auto text-red-500"><X size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              <div className="border-t border-green-200 dark:border-green-800 pt-4">
                <label className="block text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                  Color Variants <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Color name"
                    value={variantInput.name}
                    onChange={(e) => setVariantInput(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <input
                    type="color"
                    value={variantInput.colorCode}
                    onChange={(e) => setVariantInput(prev => ({ ...prev, colorCode: e.target.value }))}
                    className="h-10 rounded-xl border border-green-200 cursor-pointer"
                  />
                  <input
                    type="number"
                    placeholder="Base Price"
                    value={variantInput.basePrice}
                    onChange={(e) => setVariantInput(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <input
                    type="number"
                    placeholder="MRP"
                    value={variantInput.mrp}
                    onChange={(e) => setVariantInput(prev => ({ ...prev, mrp: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variantInput.stock}
                    onChange={(e) => setVariantInput(prev => ({ ...prev, stock: e.target.value }))}
                    className="px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <span className="text-sm">Available</span>
                    <ToggleSwitch enabled={variantInput.isAvailable} onChange={(val) => setVariantInput(prev => ({ ...prev, isAvailable: val }))} />
                  </div>
                </div>
                <button type="button" onClick={addVariant} className="mb-4 px-4 py-2.5 bg-green-600 text-white rounded-xl flex items-center gap-2">
                  <Plus size={18} /> Add Variant
                </button>
                <div className="space-y-2">
                  {(formData.variants || []).map((variant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="w-6 h-6 rounded-full border-2 border-green-300" style={{ backgroundColor: variant.colorCode }}></div>
                        <span className="font-medium">{variant.name}</span>
                        <span>Base: ₹{variant.basePrice}</span>
                        <span className="line-through">MRP: ₹{variant.mrp}</span>
                        <span>Stock: {variant.stock}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Available</span>
                          <ToggleSwitch enabled={variant.isAvailable} onChange={(val) => updateVariantAvailability(idx, val)} />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeVariant(idx)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Discount */}
              <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><DollarSign size={20} /> Discount</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={formData.discount.type}
                    onChange={(e) => handleNestedChange('discount', 'type', e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Discount value"
                    value={formData.discount.value}
                    onChange={(e) => handleNestedChange('discount', 'value', parseFloat(e.target.value))}
                    className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={formData.discount.code}
                    onChange={(e) => handleNestedChange('discount', 'code', e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  />
                </div>
              </div>

              {/* Replacement */}
              <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><RefreshCw size={20} /> Replacement</h3>
                  <ToggleSwitch enabled={formData.replacement.isAvailable} onChange={(val) => handleNestedChange('replacement', 'isAvailable', val)} />
                </div>
                {formData.replacement.isAvailable && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Duration (days)"
                      value={formData.replacement.duration}
                      onChange={(e) => handleNestedChange('replacement', 'duration', e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    />
                    <textarea
                      placeholder="Policy"
                      value={formData.replacement.policy}
                      onChange={(e) => handleNestedChange('replacement', 'policy', e.target.value)}
                      rows="2"
                      className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    />
                  </div>
                )}
              </div>

              {/* Return */}
              <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Truck size={20} /> Return</h3>
                  <ToggleSwitch enabled={formData.return.isAvailable} onChange={(val) => handleNestedChange('return', 'isAvailable', val)} />
                </div>
                {formData.return.isAvailable && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Duration (days)"
                      value={formData.return.duration}
                      onChange={(e) => handleNestedChange('return', 'duration', e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    />
                    <textarea
                      placeholder="Policy"
                      value={formData.return.policy}
                      onChange={(e) => handleNestedChange('return', 'policy', e.target.value)}
                      rows="2"
                      className="px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    />
                  </div>
                )}
              </div>

              {/* Featured & Coming Soon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2"><Star size={18} /> Featured Product</span>
                  <ToggleSwitch enabled={formData.isFeatured} onChange={(val) => setFormData(prev => ({ ...prev, isFeatured: val }))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2"><CalendarIcon size={18} /> Coming Soon</span>
                  <ToggleSwitch enabled={formData.isComingSoon} onChange={(val) => setFormData(prev => ({ ...prev, isComingSoon: val }))} />
                </div>
              </div>

              {/* Status */}
              <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl">
                <label className="block text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Status</label>
                <div className="flex flex-wrap gap-6">
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
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <label className="block text-sm text-green-700 dark:text-green-400 mb-1">Schedule Date & Time</label>
                    <DatePicker
                      selected={selectedDateTime}
                      onChange={(date) => setSelectedDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                      placeholderText="Select date and time"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo.title}
                  onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  placeholder="Enter SEO title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">SEO Description</label>
                <textarea
                  value={formData.seo.description}
                  onChange={(e) => handleNestedChange('seo', 'description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                  placeholder="Enter SEO description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">SEO Keywords</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="Enter keyword"
                  />
                  <button type="button" onClick={addKeyword} className="px-4 py-2.5 bg-green-600 text-white rounded-xl"><Plus size={18} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.seo.keywords || []).map((keyword, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 rounded-full text-sm">
                      {keyword}
                      <button type="button" onClick={() => removeKeyword(idx)} className="hover:text-red-500"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/30 dark:to-black/40 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">Product Preview</h3>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    {(existingThumbnail || formData.thumbnail) ? (
                      <img 
                        src={formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : existingThumbnail} 
                        alt="Preview" 
                        className="w-full rounded-xl shadow-lg" 
                      />
                    ) : (
                      <div className="w-full h-48 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-400">No thumbnail</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">{formData.title || 'Product Title'}</h2>
                    <p className="text-green-600 dark:text-green-400 mt-1">{formData.subtitle || 'Product Subtitle'}</p>
                    {(formData.variants || []).length > 0 && (
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-green-700 dark:text-green-300">₹{formData.variants[0].basePrice}</span>
                        <span className="ml-2 text-sm text-green-500 line-through">₹{formData.variants[0].mrp}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-green-200 dark:border-green-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-70"
            >
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
              ) : (
                <><Save size={18} /> Update Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerUpdateProduct;