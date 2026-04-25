import React from 'react';
import { motion } from 'framer-motion';
import { Store, Shield, Award, Clock, MapPin, Phone, Mail, Star, Users, Package, Truck, RotateCcw, CheckCircle, Home } from 'lucide-react';
import Button from '../ShowCaseSection/Buttons';
import { Link } from 'react-router-dom';

const SellerInProduct = ({ seller, product, productId }) => {
  if (!seller) {
    return null;
  }

  // Default values for safety
  const brandName = seller.brandName || 'Unknown Brand';
  const brandSince = seller.brandSince || 'N/A';
  const brandDescription = seller.brandDescription || 'No description available';
  const brandSpeciality = seller.brandSpeciality || 'Quality Products';
  const brandCategory = seller.brandCategory || 'General';
  const brandSubCategory = seller.brandSubCategory || 'Products';
  const logo = seller.logo;
  const coverImage = seller.coverImage;


  return (
    <div className=" mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" rounded-t-3xl overflow-hidden border-t border-t-red-200 dark:border-t-red-900 "
      >
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={`${brandName} Cover`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center">
              <Store size={64} className="text-white/50" />
            </div>
            
          )}
          </div>
           

        {/* Seller Info Content */}
        <div className='max-w-7xl mx-auto'>
        <div className="p-6 flex  justify-baseline gap-20">
            {/* Logo */} 
            <Link to={`/seller/brand/${seller.brandName}`}>      
            <div className="">
              {logo ? (
                <img 
                  src={logo} 
                  alt={brandName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white dark:bg-black object-cover border dark:border-2 border-red-500 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white dark:border-black bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-xl">
                  <Store size={40} className="text-white" />
                </div>
              )}
            </div>
            </Link>  
            
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            {/* Brand Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                  {brandName}
                </h2>
                {brandSince && brandSince !== 'N/A' && (
                  <span className="px-3 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full text-sm flex items-center gap-1">
                    <Award size={14} />
                    Since {new Date(brandSince).getFullYear()}
                  </span>
                )}
               
              </div>
              
              {/* Brand Category */}
              {(brandCategory !== 'General' || brandSubCategory !== 'Products') && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-rose-50 dark:bg-black border border-red-500 text-red-600 dark:text-red-400 rounded-full text-sm">
                    {brandCategory}
                  </span>
                  {brandSubCategory && brandSubCategory !== 'Products' && (
                    <span className="px-3 py-1 bg-rose-50 dark:bg-black border border-red-500 text-red-600 dark:text-red-400 rounded-full text-sm">
                      {brandSubCategory}
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {brandDescription && brandDescription !== 'No description available' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">About the Brand</h3>
                  <p className="text-black/70 dark:text-white/70 leading-relaxed">
                    {brandDescription}
                  </p>
                </div>
              )}

              {/* Speciality */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Speciality</h3>
                <p className="text-black/70 dark:text-white/70">
                  {brandSpeciality}
                </p>
              </div>

             
            </div>

            
          </div>
        </div>
        </div>
        
      </motion.div>
    </div>
  );
};

export default SellerInProduct;