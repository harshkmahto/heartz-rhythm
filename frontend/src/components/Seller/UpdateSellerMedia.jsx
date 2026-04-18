import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Image as ImageIcon, Trash2, Plus, 
  Camera, Loader2, Eye, CheckCircle, AlertCircle 
} from 'lucide-react';
import { updateSellerMedia } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';
import { useSeller } from '../../context/SellerContext';

const UpdateSellerMedia = ({ onClose, onUpdateComplete }) => {
  const { user } = useAuth();
  const { seller } = useSeller(); // Just get seller data, nothing else
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [previewImagesPreviews, setPreviewImagesPreviews] = useState([]);
  
  // Remove flags
  const [removeCover, setRemoveCover] = useState(false);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeAllPreviews, setRemoveAllPreviews] = useState(false);

  // Load current data from seller context
  useEffect(() => {
    if (seller) {
      setCoverImagePreview(seller.coverImage || '');
      setLogoPreview(seller.logo || '');
      setPreviewImagesPreviews(seller.previewImage || []);
    }
  }, [seller]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
      setRemoveCover(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      setRemoveLogo(false);
    }
  };

  const handlePreviewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - previewImagesPreviews.length;
    
    if (files.length > remainingSlots) {
      alert(`Maximum 3 preview images allowed. You can add ${remainingSlots} more.`);
      return;
    }
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...files]);
    setPreviewImagesPreviews([...previewImagesPreviews, ...newPreviews]);
    setRemoveAllPreviews(false);
  };

  const removeSinglePreview = (index) => {
    const newImages = [...previewImages];
    const newPreviews = [...previewImagesPreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setPreviewImages(newImages);
    setPreviewImagesPreviews(newPreviews);
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverImagePreview('');
    setRemoveCover(true);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview('');
    setRemoveLogo(true);
  };

  const handleRemoveAllPreviews = () => {
    setPreviewImages([]);
    setPreviewImagesPreviews([]);
    setRemoveAllPreviews(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      const formData = new FormData();
      
      if (removeCover) formData.append('removeCoverImage', 'true');
      if (removeLogo) formData.append('removeLogo', 'true');
      if (removeAllPreviews) formData.append('removePreviewImages', 'true');
      
      if (coverImage) formData.append('coverImage', coverImage);
      if (logo) formData.append('logo', logo);
      previewImages.forEach(img => {
        formData.append('previewImage', img);
      });
      
      const response = await updateSellerMedia(formData, userId);
      
      if (response.success) {
        alert('Media updated successfully!');
        // Call callback if provided, parent can handle refresh
        if (onUpdateComplete) onUpdateComplete();
        onClose();
      }
    } catch (error) {
      console.error('Error updating media:', error);
      alert(error.message || 'Failed to update media');
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
                <Camera className="text-emerald-600 dark:text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  Update Media
                </h2>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Manage your brand's cover image, logo, and gallery
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
          
          {/* Cover Image Section */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <ImageIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Cover Image
                </h3>
                {coverImagePreview && !removeCover && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative">
                {coverImagePreview && !removeCover ? (
                  <div className="relative group">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover preview" 
                      className="w-full h-56 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                      <label className="cursor-pointer bg-emerald-500/80 hover:bg-emerald-600 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110">
                        <Camera size={24} className="text-white" />
                        <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-emerald-50/30 dark:bg-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="text-emerald-500 mb-3" size={40} />
                      <p className="text-emerald-700 dark:text-emerald-300 font-medium">Click to upload cover image</p>
                      <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-1">Recommended: 1200x400px</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <Camera size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Brand Logo
                </h3>
                {logoPreview && !removeLogo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center">
                {logoPreview && !removeLogo ? (
                  <div className="relative group">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <label className="cursor-pointer bg-emerald-500/80 hover:bg-emerald-600 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:scale-110">
                        <Camera size={20} className="text-white" />
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-emerald-50/30 dark:bg-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40">
                    <div className="flex flex-col items-center justify-center">
                      <Plus className="text-emerald-500 mb-2" size={24} />
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center px-2">Upload Logo</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Preview Images Section */}
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <ImageIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Gallery Images <span className="text-sm text-emerald-500 dark:text-emerald-400">(Max 3)</span>
                </h3>
                {previewImagesPreviews.length > 0 && !removeAllPreviews && (
                  <button
                    type="button"
                    onClick={handleRemoveAllPreviews}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} /> Remove All
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {!removeAllPreviews && previewImagesPreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {previewImagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeSinglePreview(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-emerald-600/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white">
                        {index + 1}/3
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!removeAllPreviews && previewImagesPreviews.length < 3 && (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-all bg-emerald-50/30 dark:bg-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40">
                  <div className="flex flex-col items-center justify-center">
                    <Plus className="text-emerald-500 mb-2" size={32} />
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 text-center">Add Gallery Image</p>
                    <p className="text-xs text-emerald-500 dark:text-emerald-500 mt-1">{previewImagesPreviews.length}/3 used</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handlePreviewImagesChange} className="hidden" multiple />
                </label>
              )}
              
              {removeAllPreviews && (
                <div className="text-center py-8 bg-emerald-50/30 dark:bg-emerald-900/20 rounded-xl">
                  <AlertCircle className="text-yellow-500 mx-auto mb-2" size={32} />
                  <p className="text-emerald-700 dark:text-emerald-300">All gallery images will be removed</p>
                  <button
                    type="button"
                    onClick={() => setRemoveAllPreviews(false)}
                    className="mt-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium transition-colors"
                  >
                    Undo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current Preview Section */}
          {seller && (seller.coverImage || seller.logo || (seller.previewImage?.length > 0)) && (
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-6 py-4 border-b border-emerald-200/50 dark:border-emerald-800/30">
                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <Eye size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Current Media
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {seller.coverImage && !coverImage && !removeCover && (
                    <div className="text-center">
                      <img src={seller.coverImage} alt="Current cover" className="w-full h-20 object-cover rounded-lg shadow" />
                      <p className="text-xs text-center mt-2 text-emerald-600 dark:text-emerald-400">Current Cover</p>
                    </div>
                  )}
                  {seller.logo && !logo && !removeLogo && (
                    <div className="text-center">
                      <img src={seller.logo} alt="Current logo" className="w-20 h-20 object-cover rounded-lg mx-auto shadow" />
                      <p className="text-xs text-center mt-2 text-emerald-600 dark:text-emerald-400">Current Logo</p>
                    </div>
                  )}
                  {seller.previewImage?.length > 0 && !removeAllPreviews && previewImages.length === 0 && (
                    <div className="text-center">
                      <div className="bg-emerald-50/30 dark:bg-emerald-900/20 rounded-lg p-3">
                        <ImageIcon className="mx-auto text-emerald-500" size={24} />
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{seller.previewImage.length} Gallery Image(s)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
                    <CheckCircle size={20} />
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

export default UpdateSellerMedia;