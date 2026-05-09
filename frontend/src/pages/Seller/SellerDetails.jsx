import React, { useState, useEffect } from 'react';
import { getMySellerPannel, updateStatus } from '../../utils/apiRequest';
import Loader from '../../components/ShowCaseSection/Loader';
import { Link } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Star, Briefcase, Globe, Mail, Phone,
  Award, Heart, Shield, Truck, Clock, CheckCircle, Headphones, Disc, Mic,
  Sparkles, Zap, ChevronRight, Music, Volume2, Guitar,
  Monitor, Smartphone, Edit3, Eye, Building2, Tag, CalendarDays,
  Store, User, FileText, Banknote, MapPinned, Package, ListChecks,
  Mail as MailIcon, Phone as PhoneIcon,
  Lock, AlertCircle, Image, X, Camera, Trash2, Plus,
  Pencil,
  Loader2,
  ListOrdered
} from 'lucide-react';
import SellerButton from '../../components/ShowCaseSection/SellerButton';
import UpdateSellerMedia from '../../components/Seller/UpdateSellerMedia';
import UpdateSellerBasicDetails from '../../components/Seller/UpdateSellerBasicDetails';
import UpdateSellerPersonalDetail from '../../components/Seller/UpdateSellerPersonalDetail';
import { useAuth } from '../../context/AuthContext';
import SellerReviews from '../../components/Seller/SellerReviews';
import SellingOnOff from '../../components/Seller/Products/sellingOnOff';

const SellerDetails = () => {
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [mediaPopup, setMediaPopup] = useState(false);
  const [basicPopup, setBasicPopup] = useState(false);
  const [personalPopup, setPersonalPopup] = useState(false);
  const [enabled, setEnabled] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const { user } = useAuth();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        const res = await getMySellerPannel();
        setSeller(res.data);
      } catch (error) {
        console.error('Error fetching seller details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerDetails();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.getFullYear();
  };

  const handleMedia = () => {
    setMediaPopup(true);
  };

  const handleBasic = () => {
    setBasicPopup(true);
  };

  const handlePersonal = () => {
    setPersonalPopup(true);
  };

  const handleCloseMedia = () => {
    setMediaPopup(false);
  };

  const handleCloseBasic = () => {
    setBasicPopup(false);
  };

  const handleClosePersonal = () => {
    setPersonalPopup(false);
  };

  const handleToggle = async () => {

    if(!seller) return;

     const userId = user?.id || user?._id;
    if (!userId) {
      alert('User ID not found');
      return;
    }


    const newStatus = seller.status === 'active' ? 'inactive' : 'active';

    setUpdatingStatus(true);
    try {
      const response = await updateStatus({ status: newStatus}, userId);
      if(response.success){
        setSeller({...seller, status: newStatus});
       
      } else {
        alert(response.message || 'Failed to update status');
      }
    } catch (error) {
       alert(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
      seller.status === true ? setEnabled(true) : setEnabled(false);
    
    }
  };



  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <Loader />
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-emerald-200/50 dark:border-emerald-800/30">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
          
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Seller Panel Found
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't created a seller panel yet. Create one to start selling your products and manage your brand.
            </p>
            
            <div className="space-y-3">
              <Link to='/seller/create/seller-pannel'>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-3 px-4 mb-2 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                  Create Profile
                </button>
              </Link>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-white/50 dark:bg-black/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-800">
      
      {/* COVER IMAGE SECTION */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden">
        {seller?.coverImage ? (
          <img
            src={seller.coverImage}
            alt="cover"
            className="w-full h-full object-cover "
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center">
            <Store className="w-24 h-24 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/20 to-emerald-800/30 dark:from-gray-950/80 dark:via-gray-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
        
        {/* Verified Badge */}
        <div className="absolute top-6 right-6 z-10">
          <div className="px-4 py-2 bg-emerald-600/95 backdrop-blur-md rounded-full shadow-xl border border-emerald-400/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <p className="text-white font-semibold text-sm tracking-wide">VERIFIED SELLER</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        
        {/* BRAND BASIC INFO CARD */}
        <div className="relative bg-emerald-50 dark:bg-black/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-emerald-200/50 dark:border-emerald-800/30">
          
          {/* Logo Section - Fixed positioning */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
            
            {/* Logo with Edit Button */}
            <div className="relative flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-emerald-800 shadow-2xl overflow-hidden bg-emerald-100 dark:bg-emerald-900/50">
                  {seller?.logo ? (
                    <img 
                      src={seller.logo} 
                      alt="logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-12 h-12 text-emerald-500" />
                    </div>
                  )}
                </div>
                {/* Edit Button */}
                <button
                  onClick={handleMedia}
                  className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all duration-300 active:scale-95 border border-emerald-200 dark:border-emerald-700 cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>
            
            {/* Brand Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-2">
                <h1 className="uppercase text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-200">
                  {seller?.brandName || "BRAND NAME"}
                </h1>
                {seller.brandSince && (
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                    SINCE {formatDate(seller.brandSince)}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                {seller.brandCategory && (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {seller.brandCategory}
                  </span>
                )}
                {seller.brandSubCategory && (
                  <span className="px-3 py-1 border border-green-500 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {seller.brandSubCategory}
                  </span>
                )}
              </div>
              
              {seller.brandSpeciality && (
                <div className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30 p-3 rounded-xl border-l-4 border-emerald-500 mt-2">
                  <p className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2 text-sm justify-center md:justify-start">
                    <Sparkles className="w-4 h-4" /> {seller.brandSpeciality}
                  </p>
                </div>
              )}
            </div>
            
            {/* Update Button */}
            <div className="flex-shrink-0">
              <SellerButton 
                onClick={handleBasic}
                text='Update details'
              />
                  {/* Status */}
             <div className='flex flex-col items-center justify-center mt-8'>
                <div className='text-center'>
                  <div className='flex items-center justify-center gap-2 mb-1'>
                    <div className={`w-3 h-3 rounded-full ${
                      seller.status === 'active' 
                        ? 'bg-green-500 animate-pulse' 
                        : seller.status === 'inactive' 
                        ? 'bg-red-500' 
                        : 'bg-yellow-500'
                    }`}></div>
                    <span className={`text-sm font-semibold uppercase ${
                      seller.status === 'active' 
                        ? 'text-green-600 dark:text-green-400' 
                        : seller.status === 'inactive' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {seller.status}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {seller.status === 'active' 
                      ? 'Store is visible to customers' 
                      : seller.status === 'inactive' 
                      ? 'Store is hidden from customers' 
                      : 'Pending approval'}
                  </p>
                </div>

                {/* ✅ FIXED: Toggle button - Syncs with seller.status */}
                {seller.status !== 'pending' && (
                  <div className='mt-3'>
                    <button
                      onClick={handleToggle}
                      disabled={updatingStatus}
                      className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer
                        ${seller.status === 'active' ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}
                        ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {updatingStatus ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin mx-auto" />
                      ) : (
                        <div
                          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300
                            ${seller.status === 'active' ? "translate-x-8" : "translate-x-0"}`}
                        />
                      )}
                    </button>
                  </div>
                )}

                {/* Show message for pending status */}
                {seller.status === 'pending' && (
                  <p className='text-xs text-yellow-600 dark:text-yellow-400 mt-3 text-center'>
                    Your store is pending approval. Please wait for admin review.
                  </p>
                )}
              </div>
              <div className='flex flex-col items-center justify-center mt-8'>
                <SellingOnOff/>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN TWO COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Brand Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Brand Description */}
            {seller.brandDescription && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">About the Brand</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {seller.brandDescription}
                </p>
              </div>
            )}

            {/* Brand Features */}
            {seller.brandFeatures && seller.brandFeatures.length > 0 && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <ListChecks className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Key Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {seller.brandFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Contact Information */}
            {(seller.brandPhone || seller.brandEmail) && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Brand Contact</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {seller.brandPhone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <PhoneIcon className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{seller.brandPhone}</p>
                      </div>
                    </div>
                  )}
                  {seller.brandEmail && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <MailIcon className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{seller.brandEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Location Details */}
            {(seller.companyLocation || seller.companyAddress) && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Company Location</h3>
                </div>
                <div className="space-y-3">
                  {seller.companyLocation && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-800 dark:text-gray-200">{seller.companyLocation}</p>
                      </div>
                    </div>
                  )}
                  {seller.companyAddress && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <Building2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-gray-800 dark:text-gray-200">{seller.companyAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pickup Details */}
            {(seller.pickupLocation || seller.pickupAddress) && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pickup Information</h3>
                </div>
                <div className="space-y-3">
                  {seller.pickupLocation && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <MapPinned className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pickup Location</p>
                        <p className="text-gray-800 dark:text-gray-200">{seller.pickupLocation}</p>
                      </div>
                    </div>
                  )}
                  {seller.pickupAddress && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pickup Address</p>
                        <p className="text-gray-800 dark:text-gray-200">{seller.pickupAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview Images Gallery */}
            {seller.previewImage && seller.previewImage.length > 0 && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Image className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Gallery</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {seller.previewImage.map((img, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <img
                        src={img}
                        alt={`preview-${i}`}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Private Information */}
          <div className="space-y-6">
            
        
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 dark:text-amber-400 font-semibold">Private Information</p>
                  <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                    This information is confidential and only visible to you and team of Heartz Rhythm.
                  </p>
                </div>
              </div>
            </div>

            <SellerButton 
              onClick={handlePersonal}
              text='Update Personal Details'
            />

            {/* Seller Personal Information */}
            <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Seller Information</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Seller Name <span className='text-red-400 dark:text-red-700'>(Publicly Visible)</span></p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">{seller.sellerName || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</p>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{seller.sellerEmail || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</p>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{seller.sellerPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            {(seller.gstNumber || seller.panNumber) && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tax Information</h3>
                </div>
                <div className="space-y-3">
                  {seller.gstNumber && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">GST Number</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.gstNumber}</p>
                    </div>
                  )}
                  {seller.panNumber && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">PAN Number</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.panNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Banking Details */}
            {(seller.bankName || seller.accountNumber || seller.upi) && (
              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Banking Information</h3>
                </div>
                <div className="space-y-3">
                  {seller.bankName && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bank Name</p>
                      <p className="text-gray-800 dark:text-gray-200 mt-1">{seller.bankName}</p>
                    </div>
                  )}
                  {seller.accountNumber && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account Number</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">••••{seller.accountNumber.slice(-4)}</p>
                    </div>
                  )}
                  {seller.ifscCode && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">IFSC Code</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono uppercase text-sm mt-1">{seller.ifscCode}</p>
                    </div>
                  )}
                  {seller.bankBranch && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bank Branch</p>
                      <p className="text-gray-800 dark:text-gray-200 mt-1">{seller.bankBranch}</p>
                    </div>
                  )}
                  {seller.bankUserName && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account Holder Name</p>
                      <p className="text-gray-800 dark:text-gray-200 mt-1">{seller.bankUserName}</p>
                    </div>
                  )}
                  {seller.upi && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">UPI ID</p>
                      <p className="text-gray-800 dark:text-gray-200 mt-1">{seller.upi}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additinal Information */}

              <div className="bg-emerald-50 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                 <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <ListOrdered className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Additional Information</h3>
                </div>

                <div className='space-y-3'>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Products</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.totalProducts}</p>
                    </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Products</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.activeProducts}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Draft Products</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.draftProducts}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Scheduled Products</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.scheduledProducts}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Stock</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.totalStock}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Featured Products</p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-sm mt-1">{seller.featuredProducts}</p>
                    </div>

                </div>
                
            </div>



          </div>
        </div>
      </div>

      <SellerReviews seller={seller}/>

      {/* Popups - Fixed with proper overlays */}
      {mediaPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <UpdateSellerMedia onClose={handleCloseMedia} />
          </div>
        </div>
      )}

      {basicPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <UpdateSellerBasicDetails onClose={handleCloseBasic} />
          </div>
        </div>
      )}

      {personalPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <UpdateSellerPersonalDetail onClose={handleClosePersonal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDetails;