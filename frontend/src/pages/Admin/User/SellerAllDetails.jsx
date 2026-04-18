import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSellerWithPanelById } from '../../../utils/apiRequest';
import { Copy, Check, User, Mail, Phone, Calendar, Shield, AlertCircle, Building, MapPin, Banknote, FileText, Truck, Award, X, Eye, Calendar as CalendarIcon, Star, Tag, Globe, Clock, CreditCard, Home, Navigation, Briefcase, Info, ShieldCheck, AlertTriangle } from 'lucide-react';

const SellerAllDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchSellerDetails();
    } else {
      setError('No seller ID provided');
      setLoading(false);
    }
  }, [userId]);

  const fetchSellerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSellerWithPanelById(userId);
      if (response.success) {
        setSellerData(response);
      } else {
        setError(response.message || 'Failed to fetch seller details');
      }
    } catch (error) {
      setError(error?.message || 'Failed to fetch seller details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const openImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-black dark:text-white">Loading seller details...</p>
        </div>
      </div>
    );
  }

  if (error || !sellerData || !sellerData.seller) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500 dark:text-red-400" />
          <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            {error || 'Seller not found'}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            User ID: {userId || 'Not provided'}
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              Go Back
            </button>
            <button
              onClick={fetchSellerDetails}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { seller, sellerPanel } = sellerData;
  const hasPanel = sellerPanel && sellerPanel._id;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InfoRow = ({ label, value, copyable = false, fieldName = "", icon: Icon }) => (
    <div className="flex justify-between items-start py-3 border-b last:border-0 border-gray-200 dark:border-red-900/30">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-red-500 dark:text-red-400" />}
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm font-medium text-gray-800 dark:text-white break-all text-right">
          {value || '—'}
        </span>
        {copyable && value && (
          <button
            onClick={() => copyToClipboard(value.toString(), fieldName)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition flex-shrink-0"
          >
            {copiedField === fieldName ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      review: 'bg-orange-500'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${colors[status] || 'bg-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-black/95 border-b border-red-100 dark:border-red-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-lg transition text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Seller Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 mb-8 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {seller.profilePicture?.url ? (
                <img
                  src={seller.profilePicture.url}
                  alt={seller.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-red-500 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openImagePopup(seller.profilePicture.url)}
                />
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-950/30">
                  <User className="h-16 w-16 text-red-500 dark:text-red-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {seller.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {seller._id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(seller._id, 'id')}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    >
                      {copiedField === 'id' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={seller.status} />
                  {seller.isBlocked && (
                    <span className="px-2 py-1 rounded-full text-xs text-white bg-red-500 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Blocked
                    </span>
                  )}
                  {seller.verified && (
                    <span className="px-2 py-1 rounded-full text-xs text-white bg-green-500 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InfoRow label="Email" value={seller.email} copyable fieldName="email" icon={Mail} />
                <InfoRow label="Phone" value={seller.phone} copyable fieldName="phone" icon={Phone} />
                <InfoRow label="Role" value={seller.role} icon={User} />
                <InfoRow label="Created At" value={formatFullDate(seller.createdAt)} icon={Calendar} />
                <InfoRow label="Updated At" value={formatFullDate(seller.updatedAt)} icon={Clock} />
                <InfoRow label="Block Status" value={seller.isBlocked ? 'Blocked' : 'Active'} icon={AlertTriangle} />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Section */}
        {hasPanel && (
          <>
            {/* Cover Image */}
            {sellerPanel.coverImage && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={sellerPanel.coverImage}
                  alt="Cover"
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Logo and Basic Brand Info - No field names */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 mb-8 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {sellerPanel.logo && (
                  <div 
                    className="flex-shrink-0 cursor-pointer group relative"
                    onClick={() => openImagePopup(sellerPanel.logo)}
                  >
                    <img
                      src={sellerPanel.logo}
                      alt="Logo"
                      className="w-32 h-32 rounded-full object-cover border-2 border-red-500 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="space-y-4">
                    <p className="text-3xl font-bold text-gray-800 dark:text-white uppercase">
                      {sellerPanel.brandName || '—'}
                    </p>
                    <div className="flex flex-col  gap-4">
                      <span className="text-base text-gray-600 dark:text-gray-300">
                        {sellerPanel.brandCategory || '—'} {sellerPanel.brandSubCategory && `› ${sellerPanel.brandSubCategory}`}
                      </span>
                      
                      <span className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-300">
                        <span className="text-base text-gray-600 dark:text-gray-300">• </span> {sellerPanel.brandSpeciality || '—'}
                      </span>
                     
                      <span className="text-base text-gray-600 dark:text-gray-300">
                        Since {sellerPanel.brandSince ? new Date(sellerPanel.brandSince).getFullYear() : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Description and Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Brand Description</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {sellerPanel.brandDescription || 'No description provided'}
                </p>
                {sellerPanel.brandFeatures && sellerPanel.brandFeatures.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {sellerPanel.brandFeatures.map((feature, idx) => (
                        <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border dark:border-red-900/30">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Brand Contact</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Brand Email" value={sellerPanel.brandEmail} copyable fieldName="brandEmail" icon={Mail} />
                  <InfoRow label="Brand Phone" value={sellerPanel.brandPhone} copyable fieldName="brandPhone" icon={Phone} />
                  <InfoRow label="Company Location" value={sellerPanel.companyLocation} icon={MapPin} />
                  <InfoRow label="Company Address" value={sellerPanel.companyAddress} icon={Home} />
                </div>
              </div>
            </div>

               {/* Banking and Seller Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Banknote className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Banking Details</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Bank Name" value={sellerPanel.bankName} icon={Building} />
                  <InfoRow label="Account Number" value={sellerPanel.accountNumber} icon={CreditCard} />
                  <InfoRow label="IFSC Code" value={sellerPanel.ifscCode} copyable fieldName="ifsc" icon={CreditCard} />
                  <InfoRow label="Bank Branch" value={sellerPanel.bankBranch} icon={Home} />
                  <InfoRow label="Account Holder" value={sellerPanel.bankUserName} icon={User} />
                  <InfoRow label="UPI ID" value={sellerPanel.upi} copyable fieldName="upi" icon={Globe} />
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Seller Information</h3>
                </div>
                <div className="space-y-3">
                  <InfoRow label="Seller Name" value={sellerPanel.sellerName} icon={User} />
                  <InfoRow label="Seller Email" value={sellerPanel.sellerEmail} copyable fieldName="sellerEmail" icon={Mail} />
                  <InfoRow label="Seller Phone" value={sellerPanel.sellerPhone} copyable fieldName="sellerPhone" icon={Phone} />
                </div>
                
                {/* Tax Information  */}
                {(sellerPanel.gstNumber || sellerPanel.panNumber) && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-red-900/30">
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500 dark:text-red-400" />
                      Tax Information
                    </h4>
                    <div className="space-y-3">
                      {sellerPanel.gstNumber && (
                        <InfoRow label="GST Number" value={sellerPanel.gstNumber} copyable fieldName="gst" />
                      )}
                      {sellerPanel.panNumber && (
                        <InfoRow label="PAN Number" value={sellerPanel.panNumber} copyable fieldName="pan" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Location - */}
            {(sellerPanel.pickupLocation || sellerPanel.pickupAddress) && (
              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 mb-8 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Pickup Location</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {sellerPanel.pickupLocation && (
                    <InfoRow label="Location" value={sellerPanel.pickupLocation} icon={Navigation} />
                  )}
                  {sellerPanel.pickupAddress && (
                    <InfoRow label="Address" value={sellerPanel.pickupAddress} icon={MapPin} />
                  )}
                </div>
              </div>
            )}

            {/* Preview Images */}
            {sellerPanel.previewImage && sellerPanel.previewImage.length > 0 && (
              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-red-950/5 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Preview Images</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sellerPanel.previewImage.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => openImagePopup(img)}
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Panel Message */}
        {!hasPanel && (
          <div className="text-center py-12 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/5">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500 dark:text-red-400" />
            <p className="text-gray-500 dark:text-gray-400">
              This seller has not set up their panel details yet.
            </p>
          </div>
        )}
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeImagePopup}
        >
          <div className="relative max-w-5xl max-h-[90vh] m-4">
            <button
              onClick={closeImagePopup}
              className="absolute -top-12 right-0 p-2 text-white hover:text-red-400 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Popup"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerAllDetails;