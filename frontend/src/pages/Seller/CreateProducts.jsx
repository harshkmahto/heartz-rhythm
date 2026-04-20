import React, { useState } from 'react';
import { 
  Package, Image, Settings, SearchCode, Eye, Send, Plus, X, Upload, Check,
  ChevronRight, Trash2, Calendar as CalendarIcon, Star, Video, Image as ImageIcon,
  AlertCircle, RefreshCw, Clock
} from 'lucide-react';
import { createProduct } from "../../utils/product.apiRequest";

const CreateProducts = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
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

  // Temporary states
  const [featureInput, setFeatureInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [showCaseInput, setShowCaseInput] = useState({ key: '', value: '', image: null });
  const [aboutInput, setAboutInput] = useState({ key: '', value: '' });
  const [variantInput, setVariantInput] = useState({
    name: '', colorCode: '#10b981', basePrice: '', mrp: '', stock: '', isAvailable: true
  });
  const [showCaseImagePreview, setShowCaseImagePreview] = useState(null);

  const tabs = [
    { id: 'basic', label: 'Basic Details', icon: Package },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'details', label: 'Pricing & Policies', icon: Settings },
    { id: 'seo', label: 'SEO', icon: SearchCode },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (formData.variants.length === 0) newErrors.variants = 'At least one variant is required';
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail is required';
    
    if (formData.status === 'scheduled') {
      if (!scheduledDate) newErrors.scheduledDate = 'Schedule date is required';
      if (!scheduledTime) newErrors.scheduledTime = 'Schedule time is required';
      
      if (scheduledDate && scheduledTime) {
        const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const now = new Date();
        if (selectedDateTime <= now) {
          newErrors.scheduledDateTime = 'Schedule date and time must be in the future';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      if (errors.variants) setErrors(prev => ({ ...prev, variants: '' }));
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
      if (type === 'thumbnail' && errors.thumbnail) setErrors(prev => ({ ...prev, thumbnail: '' }));
    } else {
      setFormData(prev => ({ ...prev, [type]: [...prev[type], ...files] }));
    }
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
        showCase: [...prev.showCase, { ...showCaseInput, imagePreview: showCaseImagePreview }]
      }));
      setShowCaseInput({ key: '', value: '', image: null });
      setShowCaseImagePreview(null);
    }
  };

  const removeShowCase = (index) => {
    setFormData(prev => ({ ...prev, showCase: prev.showCase.filter((_, i) => i !== index) }));
  };

  const removeMedia = (type, index) => {
    setFormData(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinTimeForDate = () => {
    if (!scheduledDate) return '00:00';
    const selectedDate = new Date(scheduledDate);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (selectedDate.toISOString().split('T')[0] === todayStr) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      return `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    }
    return '00:00';
  };

  const handleScheduledDateChange = (e) => {
    const date = e.target.value;
    setScheduledDate(date);
    setScheduledTime('');
    if (errors.scheduledDate) setErrors(prev => ({ ...prev, scheduledDate: '' }));
    if (errors.scheduledDateTime) setErrors(prev => ({ ...prev, scheduledDateTime: '' }));
  };

  const handleScheduledTimeChange = (e) => {
    const time = e.target.value;
    const selectedDateTime = new Date(`${scheduledDate}T${time}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      setErrors(prev => ({ ...prev, scheduledDateTime: 'Please select a future time' }));
    } else {
      setErrors(prev => ({ ...prev, scheduledDateTime: '' }));
    }
    setScheduledTime(time);
    if (errors.scheduledTime) setErrors(prev => ({ ...prev, scheduledTime: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    
    const submitData = new FormData();
    const productData = { ...formData };
    
    delete productData.thumbnail;
    delete productData.preview;
    delete productData.images;
    delete productData.gallery;
    delete productData.videos;
    delete productData.showCase;
    
    submitData.append('productData', JSON.stringify(productData));
    
    if (formData.thumbnail) submitData.append('thumbnail', formData.thumbnail);
    if (formData.preview) submitData.append('preview', formData.preview);
    
    formData.images.forEach(img => submitData.append('images', img));
    formData.gallery.forEach(img => submitData.append('gallery', img));
    formData.videos.forEach(video => submitData.append('videos', video));
    
    formData.showCase.forEach((item, idx) => {
      if (item.image) submitData.append(`showCase_${idx}`, item.image);
    });
    
    if (formData.status === 'scheduled' && scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      submitData.append('scheduledAt', scheduledDateTime.toISOString());
    }
    
    try {
      const response = await createProduct(submitData);
      if (response.success) {
        alert('Product created successfully!');
        window.location.href = '/seller/products';
      }
    } catch (error) {
      console.error('Product creation error:', error);
      setSubmitError(error.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
        enabled ? 'bg-green-600' : 'bg-gray-600'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const renderBasicDetails = () => (
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
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.title ? 'border-red-500' : 'border-green-200 dark:border-green-700'
            } bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500`}
            placeholder="Enter product title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Product Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500"
            placeholder="Enter product subtitle"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Product Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500"
          placeholder="Enter detailed product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Product Features</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            placeholder="Enter a feature"
          />
          <button type="button" onClick={addFeature} className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl flex items-center gap-2">
            <Plus size={18} /> Add Feature
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm">
              <Check size={14} /> {feature}
              <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-500"><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.category ? 'border-red-500' : 'border-green-200 dark:border-green-700'
            } bg-white dark:bg-black/40`}
            placeholder="e.g., Electronics"
          />
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Sub Category</label>
          <input
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            placeholder="e.g., Smartphones"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.brand ? 'border-red-500' : 'border-green-200 dark:border-green-700'
            } bg-white dark:bg-black/40`}
            placeholder="e.g., Apple"
          />
          {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
        </div>
      </div>

      {/* About Section */}
      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">About (Key-Value Pairs)</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Key (e.g., Material)"
            value={aboutInput.key}
            onChange={(e) => setAboutInput(prev => ({ ...prev, key: e.target.value }))}
            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
          />
          <input
            type="text"
            placeholder="Value (e.g., Stainless Steel)"
            value={aboutInput.value}
            onChange={(e) => setAboutInput(prev => ({ ...prev, value: e.target.value }))}
            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
          />
          <button type="button" onClick={addAbout} className="px-4 py-2.5 bg-green-600 text-white rounded-xl"><Plus size={18} /> Add</button>
        </div>
        <div className="space-y-2">
          {formData.about.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div><span className="font-medium text-green-800 dark:text-green-300">{item.key}:</span><span className="ml-2 text-green-700 dark:text-green-400">{item.value}</span></div>
              <button type="button" onClick={() => removeAbout(idx)} className="text-red-500"><X size={18} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Color Variants */}
      <div className="border-t border-green-200 dark:border-green-800 pt-6">
        <label className="block text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
          Color Variants <span className="text-red-500">*</span>
        </label>
        {errors.variants && <p className="mb-3 text-sm text-red-500">{errors.variants}</p>}
        
        {/* Variant Input Fields with Labels */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Color Name</label>
            <input
              type="text"
              placeholder="e.g., Midnight Blue"
              value={variantInput.name}
              onChange={(e) => setVariantInput(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Color Code</label>
            <input
              type="color"
              value={variantInput.colorCode}
              onChange={(e) => setVariantInput(prev => ({ ...prev, colorCode: e.target.value }))}
              className="w-full h-10 rounded-xl border border-green-200 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Base Price (₹)</label>
            <input
              type="number"
              placeholder="Base Price"
              value={variantInput.basePrice}
              onChange={(e) => setVariantInput(prev => ({ ...prev, basePrice: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">MRP (₹)</label>
            <input
              type="number"
              placeholder="MRP"
              value={variantInput.mrp}
              onChange={(e) => setVariantInput(prev => ({ ...prev, mrp: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Stock Quantity</label>
            <input
              type="number"
              placeholder="Stock"
              value={variantInput.stock}
              onChange={(e) => setVariantInput(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Availability</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <span className="text-sm text-green-700 dark:text-green-300">Available</span>
              <ToggleSwitch enabled={variantInput.isAvailable} onChange={(val) => setVariantInput(prev => ({ ...prev, isAvailable: val }))} />
            </div>
          </div>
        </div>
        
        <button type="button" onClick={addVariant} className="mb-4 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl flex items-center gap-2">
          <Plus size={18} /> Add Color Variant
        </button>
        
        <div className="space-y-2">
          {formData.variants.map((variant, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-6 h-6 rounded-full border-2 border-green-300" style={{ backgroundColor: variant.colorCode }}></div>
                <span className="font-medium text-green-800 dark:text-green-200">{variant.name}</span>
                <span className="text-green-700 dark:text-green-400">Base: ₹{variant.basePrice}</span>
                <span className="text-green-700 dark:text-green-400 line-through">MRP: ₹{variant.mrp}</span>
                <span className="text-green-700 dark:text-green-400">Stock: {variant.stock}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-700 dark:text-green-400">Available</span>
                  <ToggleSwitch enabled={variant.isAvailable} onChange={(val) => updateVariantAvailability(idx, val)} />
                </div>
              </div>
              <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-600"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
          Thumbnail Image <span className="text-red-500">*</span>
        </label>
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          errors.thumbnail ? 'border-red-500' : 'border-green-300 dark:border-green-600 hover:border-green-500'
        } bg-white dark:bg-black/20`}>
          {formData.thumbnail ? (
            <div className="relative inline-block">
              <img src={URL.createObjectURL(formData.thumbnail)} alt="Thumbnail" className="w-32 h-32 object-cover rounded-xl shadow-lg" />
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><X size={14} /></button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <Upload size={40} className="text-green-500" />
              <span className="text-green-700 dark:text-green-300">Click to upload thumbnail</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'thumbnail')} />
            </label>
          )}
        </div>
        {errors.thumbnail && <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Product Images (Multiple)</label>
        <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 bg-white dark:bg-black/20">
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={URL.createObjectURL(img)} alt={`Product ${idx}`} className="w-24 h-24 object-cover rounded-xl shadow" />
                <button type="button" onClick={() => removeMedia('images', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer flex items-center justify-center gap-2 text-green-600 hover:text-green-700">
            <Plus size={20} /> <span>Add Product Images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'images')} />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Gallery Images</label>
        <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 bg-white dark:bg-black/20">
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.gallery.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={URL.createObjectURL(img)} alt={`Gallery ${idx}`} className="w-24 h-24 object-cover rounded-xl shadow" />
                <button type="button" onClick={() => removeMedia('gallery', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer flex items-center justify-center gap-2 text-green-600 hover:text-green-700">
            <Plus size={20} /> <span>Add Gallery Images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'gallery')} />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Preview Video</label>
        <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 text-center bg-white dark:bg-black/20">
          {formData.preview ? (
            <div className="relative inline-block">
              <video src={URL.createObjectURL(formData.preview)} className="w-40 h-40 object-cover rounded-xl shadow" controls />
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, preview: null }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <Upload size={40} className="text-green-500" />
              <span className="text-green-700 dark:text-green-300">Upload preview video</span>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'preview')} />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Additional Videos</label>
        <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl p-6 bg-white dark:bg-black/20">
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.videos.map((video, idx) => (
              <div key={idx} className="relative">
                <video src={URL.createObjectURL(video)} className="w-32 h-32 object-cover rounded-xl shadow" />
                <button type="button" onClick={() => removeMedia('videos', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer flex items-center justify-center gap-2 text-green-600 hover:text-green-700">
            <Plus size={20} /> <span>Add More Videos</span>
            <input type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'videos')} />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Showcase Items</label>
        <div className="space-y-4 p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
          <div className="flex gap-3 flex-wrap">
            <label className="cursor-pointer flex flex-col items-center gap-1 p-2 border border-green-200 dark:border-green-700 rounded-lg">
              {showCaseImagePreview ? (
                <img src={showCaseImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <ImageIcon size={32} className="text-green-500" />
              )}
              <span className="text-xs text-green-600">Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleShowCaseImageChange} />
            </label>
            <input
              type="text"
              placeholder="Key (e.g., Warranty)"
              value={showCaseInput.key}
              onChange={(e) => setShowCaseInput(prev => ({ ...prev, key: e.target.value }))}
              className="flex-1 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
            <input
              type="text"
              placeholder="Value (e.g., 2 Years)"
              value={showCaseInput.value}
              onChange={(e) => setShowCaseInput(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
            <button type="button" onClick={addShowCase} className="px-4 py-2 bg-green-600 text-white rounded-xl"><Plus size={18} /> Add</button>
          </div>
          <div className="space-y-2">
            {formData.showCase.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                {item.imagePreview && <img src={item.imagePreview} alt="Showcase" className="w-12 h-12 object-cover rounded-lg" />}
                <span className="font-medium text-green-800 dark:text-green-300">{item.key}:</span>
                <span className="text-green-700 dark:text-green-400">{item.value}</span>
                <button type="button" onClick={() => removeShowCase(idx)} className="ml-auto text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-8">
      {/* Discount */}
      <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2"><Star size={20} /> Discount Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Discount Type</label>
            <select
              value={formData.discount.type}
              onChange={(e) => handleNestedChange('discount', 'type', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Discount Value</label>
            <input
              type="number"
              placeholder="Enter discount value"
              value={formData.discount.value}
              onChange={(e) => handleNestedChange('discount', 'value', parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
          </div>
          <div>
            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Discount Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g., SAVE10"
              value={formData.discount.code}
              onChange={(e) => handleNestedChange('discount', 'code', e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
            />
          </div>
        </div>
      </div>

      {/* Replacement */}
      <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 flex items-center gap-2"><Package size={20} /> Replacement Policy</h3>
          <ToggleSwitch enabled={formData.replacement.isAvailable} onChange={(val) => handleNestedChange('replacement', 'isAvailable', val)} />
        </div>
        {formData.replacement.isAvailable && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Replacement Duration (Days)</label>
              <input
                type="number"
                placeholder="e.g., 7"
                value={formData.replacement.duration}
                onChange={(e) => handleNestedChange('replacement', 'duration', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
              />
            </div>
            <div>
              <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Replacement Policy Details</label>
              <textarea
                placeholder="Describe replacement policy..."
                value={formData.replacement.policy}
                onChange={(e) => handleNestedChange('replacement', 'policy', e.target.value)}
                rows="2"
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
              />
            </div>
          </div>
        )}
      </div>

      {/* Return */}
      <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 flex items-center gap-2"><RefreshCw size={20} /> Return Policy</h3>
          <ToggleSwitch enabled={formData.return.isAvailable} onChange={(val) => handleNestedChange('return', 'isAvailable', val)} />
        </div>
        {formData.return.isAvailable && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Return Duration (Days)</label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={formData.return.duration}
                onChange={(e) => handleNestedChange('return', 'duration', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
              />
            </div>
            <div>
              <label className="block text-xs text-green-600 dark:text-green-400 mb-1">Return Policy Details</label>
              <textarea
                placeholder="Describe return policy..."
                value={formData.return.policy}
                onChange={(e) => handleNestedChange('return', 'policy', e.target.value)}
                rows="2"
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
              />
            </div>
          </div>
        )}
      </div>

      {/* Featured & Coming Soon Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
        <div className="flex items-center justify-between">
          <span className="text-green-800 dark:text-green-300 font-medium flex items-center gap-2"><Star size={18} /> Featured Product</span>
          <ToggleSwitch enabled={formData.isFeatured} onChange={(val) => setFormData(prev => ({ ...prev, isFeatured: val }))} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-green-800 dark:text-green-300 font-medium flex items-center gap-2"><CalendarIcon size={18} /> Coming Soon</span>
          <ToggleSwitch enabled={formData.isComingSoon} onChange={(val) => setFormData(prev => ({ ...prev, isComingSoon: val }))} />
        </div>
      </div>

      {/* Status with Date/Time Picker */}
      <div className="p-4 border border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-black/20">
        <label className="block text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Product Status</label>
        <div className="flex flex-wrap gap-6">
          {['draft', 'active', 'scheduled'].map((status) => (
            <label key={status} className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={handleInputChange}
                className="text-green-600 focus:ring-green-500 w-4 h-4"
              />
              <span className="text-green-800 dark:text-green-300 capitalize">{status}</span>
            </label>
          ))}
        </div>
        
        {formData.status === 'scheduled' && (
          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Schedule Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={handleScheduledDateChange}
                    min={getMinDate()}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.scheduledDate || errors.scheduledDateTime ? 'border-red-500' : 'border-green-200 dark:border-green-700'
                    } bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 cursor-pointer`}
                  />
                </div>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">Select a future date (click on year/month to navigate)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Schedule Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={handleScheduledTimeChange}
                    min={scheduledDate === getMinDate() ? getMinTimeForDate() : '00:00'}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.scheduledTime || errors.scheduledDateTime ? 'border-red-500' : 'border-green-200 dark:border-green-700'
                    } bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500 cursor-pointer`}
                  />
                </div>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">Select a future time</p>
              </div>
            </div>
            {(errors.scheduledDate || errors.scheduledTime || errors.scheduledDateTime) && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> 
                {errors.scheduledDateTime || errors.scheduledDate || errors.scheduledTime}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">SEO Meta Title</label>
        <input
          type="text"
          value={formData.seo.title}
          onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
          placeholder="Enter SEO title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">SEO Meta Description</label>
        <textarea
          value={formData.seo.description}
          onChange={(e) => handleNestedChange('seo', 'description', e.target.value)}
          rows="3"
          className="w-full px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
          placeholder="Enter SEO meta description"
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
            placeholder="Enter keyword and press Enter"
          />
          <button type="button" onClick={addKeyword} className="px-4 py-2.5 bg-green-600 text-white rounded-xl"><Plus size={18} /> Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.seo.keywords.map((keyword, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm">
              {keyword}
              <button type="button" onClick={() => removeKeyword(idx)} className="hover:text-red-500"><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/30 dark:to-black/40 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">Product Preview</h3>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            {formData.thumbnail ? (
              <img src={URL.createObjectURL(formData.thumbnail)} alt="Preview" className="w-full rounded-xl shadow-lg" />
            ) : (
              <div className="w-full h-48 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-400">No thumbnail</div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">{formData.title || 'Product Title'}</h2>
            <p className="text-green-600 dark:text-green-400 mt-1">{formData.subtitle || 'Product Subtitle'}</p>
            {formData.variants.length > 0 && (
              <div className="mt-4">
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">₹{formData.variants[0].basePrice}</span>
                <span className="ml-2 text-sm text-green-500 line-through">₹{formData.variants[0].mrp}</span>
                {formData.discount.value > 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-sm rounded-full">
                    {formData.discount.type === 'percentage' ? `${formData.discount.value}% OFF` : `₹${formData.discount.value} OFF`}
                  </span>
                )}
              </div>
            )}
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm">{formData.category || 'Category'}</span>
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm">{formData.brand || 'Brand'}</span>
            </div>
          </div>
        </div>
        
        {formData.description && (
          <div className="mt-6">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Description</h4>
            <p className="text-green-700 dark:text-green-300">{formData.description}</p>
          </div>
        )}
        
        {formData.features.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Features</h4>
            <ul className="list-disc list-inside space-y-1">
              {formData.features.map((feature, idx) => (<li key={idx} className="text-green-700 dark:text-green-300">{feature}</li>))}
            </ul>
          </div>
        )}
        
        {formData.variants.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Available Colors</h4>
            <div className="flex gap-3">
              {formData.variants.map((variant, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-green-300 shadow" style={{ backgroundColor: variant.colorCode }}></div>
                  <span className="text-xs text-green-700 dark:text-green-300 mt-1 block">{variant.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            Create New Product
          </h1>
          <p className="text-green-600 dark:text-green-400 mt-2">Fill in the details to list your product</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 dark:text-red-400">{submitError}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 border-b border-green-200 dark:border-green-800 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                    : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                }`}
              >
                <Icon size={18} /> {tab.label} {activeTab === tab.id && <ChevronRight size={16} />}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-green-200 dark:border-green-800">
          {activeTab === 'basic' && renderBasicDetails()}
          {activeTab === 'media' && renderMedia()}
          {activeTab === 'details' && renderDetails()}
          {activeTab === 'seo' && renderSEO()}
          {activeTab === 'preview' && renderPreview()}

          <div className="mt-8 pt-6 border-t border-green-200 dark:border-green-800 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;