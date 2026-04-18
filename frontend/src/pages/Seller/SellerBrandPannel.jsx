import { useState } from 'react';
import {
  MapPin, Calendar, Users, Star, Briefcase, Globe, Mail, Phone,
  Award, Heart, Shield, Truck, Clock,
  ExternalLink, CheckCircle, Headphones, Disc, Mic,
  Sparkles, Zap, ChevronRight, Music, Volume2, Guitar,
  Monitor, Smartphone, Edit3, Eye, Building2, Tag, CalendarDays,
  Store, User, FileText, Banknote, MapPinned, Package,
  ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UpdateSellerPannel from '../../components/Seller/UpdateSellerBasicDetails';
import { useSeller } from '../../context/SellerContext'; 
import Loader from '../../components/ShowCaseSection/Loader';

const SellerBrandPanel = () => {
  const [updatePopup, setupdatePopup] = useState(false);

  const [imageModel, setImageModel] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);

  const { seller, loading, error, isSellerExists } = useSeller();

  const handleUpdate = () => {
    setupdatePopup(true);
  };

  const handleUpdateClose = () => {
    setupdatePopup(false);
  };


  const handleImageModel = (img) => {
    setSelectedImage(img);
    setImageModel(true);
  };

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <Loader/>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Seller Data</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (!isSellerExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-800">
        <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-2xl max-w-md">
          <div className="text-yellow-600 text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">No Seller Profile Found</h3>
          <p className="text-yellow-600 dark:text-yellow-300 mb-4">Please create a seller profile to access this page.</p>
          <Link 
            to="/seller/create/seller-pannel" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
          >
            Create Seller Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-800">
    
      {/* Hero Banner Section */}
      <div className="relative">
        <div className="relative w-full h-[320px] md:h-[440px] lg:h-[500px] overflow-hidden">
          {seller?.coverImage ? (
            <img
              src={seller.coverImage}
              alt={`${seller.brandName || 'Brand'} Cover`}
              className="w-full h-full object-cover "
             
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center">
              <Store className="w-24 h-24 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/20 to-emerald-800/30 dark:from-gray-950/80 dark:via-gray-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>

          {/* Premium Seller Badge */}
          <div className="absolute top-6 right-6 z-10">
            <div className="px-4 py-2 bg-emerald-600/95 backdrop-blur-md rounded-full shadow-xl border border-emerald-400/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <p className="text-white font-semibold text-sm tracking-wide">VERIFIED SELLER</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Profile Card */}
        <div className="relative -mt-20 sm:-mt-24 md:-mt-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-200/50 dark:border-emerald-800/30">
              
              {/* Brand Logo */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
                  {seller?.logo ? (
                    <img
                      src={seller.logo}
                      alt={`${seller.brandName || 'Brand'} Logo`}
                      className="w-full h-full object-cover "
                      onClick={() => handleImageModel(seller.logo)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50">
                      <Store className="w-12 h-12 text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              

              {/* Brand Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-200">
                    {seller.brandName || "BRAND NAME"}
                  </h1>
                 
                </div>

                {/* Brand Speciality */}
              {seller.brandSpeciality && (
                <div className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30 p-4 rounded-xl mb-6 border-l-4 border-emerald-500 mt-2">
                  <p className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> {seller.brandSpeciality}
                  </p>
                </div>
              )}
               {seller.brandSince && (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                      SINCE {new Date (seller.brandSince).getFullYear()}
                    </span>
                  )}
               
                {seller.brandCategory && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{seller.brandCategory}</span>
                    {seller.brandSubCategory && (
                      <span className="text-sm text-gray-500 dark:text-gray-500">• {seller.brandSubCategory}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <button 
                  onClick={handleUpdate}
                  className='group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer'
                >
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold">Update</span>
                </button>
                <Link to='/seller/seller-details'>
                  <button className='group flex items-center gap-2 bg-white dark:bg-gray-800 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer'>
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold ">View Profile</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2">
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-7 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">About {seller.brandName || 'the Brand'}</h2>
              </div>
              
               {seller.brandDescription && (
                  <p className="text-black dark:text-white font-semibold flex gap-2 items-center m-2">
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full "></span>
                    {seller.brandDescription}
                  </p>
                )}
              
              {/* Brand Features */}
              {seller.brandFeatures &&  (
                <div className="mb-4 mt-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    
                    {seller.brandFeatures.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Company Details Card */}
          <div>
            <div className="bg-white/10 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h3 className="uppercase text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                Company Details
              </h3>
              <div className="space-y-4">
                {seller.brandSince && (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Established</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{new Date(seller.brandSince).toLocaleDateString('en-US',{year:'numeric', month:'short', day:'numeric'} )}</p>
                    </div>
                  </div>
                )}
                
                {seller.brandCategory && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {seller.brandCategory}
                        {seller.brandSubCategory && ` / ${seller.brandSubCategory}`}
                      </p>
                    </div>
                  </div>
                )}

                {seller.brandPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Brand Phone</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{seller.brandPhone}</p>
                    </div>
                  </div>
                )}

                {seller.brandEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Brand Email</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{seller.brandEmail}</p>
                    </div>
                  </div>
                )}

                {seller.companyLocation && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Company Location</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{seller.companyLocation}</p>
                    </div>
                  </div>
                )}

                {seller.companyAddress && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Company Address</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{seller.companyAddress}</p>
                    </div>
                  </div>
                )}

                {seller.sellerName && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Seller Name</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{seller.sellerName}</p>
                    </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

      

        {/* Preview Images Section */}
        {seller.previewImage && seller.previewImage.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-emerald-500" />
                Gallery
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seller.previewImage.map((image, idx) => (
                <div key={idx} className="group bg-white dark:bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100 dark:border-emerald-800/30">
                  <div className="relative h-full w-full overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onClick={() => handleImageModel(image)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Popup */}

      { imageModel && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => {
            setImageModel(false);
            setSelectedImage(null);
          }}
        >
          <div 
            className="relative max-w-4xl w-full p-4"
            onClick={(e) => e.stopPropagation()} 
          >
     
              {/* Image */}
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}
              

        {/* Update Popup */}
        {updatePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl">
              <UpdateSellerPannel onClose={handleUpdateClose} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default SellerBrandPanel;