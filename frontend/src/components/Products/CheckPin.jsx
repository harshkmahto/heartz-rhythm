import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Truck, AlertCircle, X } from 'lucide-react';

const CheckPin = ({ product, productId, isOutOfStock }) => {
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [error, setError] = useState('');

  // Handle pincode input - only allow 6 digits
  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 6) {
      setPincode(value);
      setError('');
      // Reset delivery status when user starts typing new pincode
      if (deliveryStatus) setDeliveryStatus(null);
    }
  };

  // Check delivery availability
  const checkDeliveryAvailability = async () => {
    // Validate pincode
    if (!pincode) {
      setError('Please enter a pincode');
      return;
    }
    
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsChecking(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call to check pincode
      // For now, simulating delivery available for all pincodes
      // Later you can implement real pincode check logic
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - always delivery available for demo
      // Replace this with actual API call:
      // const response = await checkPincodeAvailability(pincode, productId);
      // if (response.data.isDeliverable) {
      //   setDeliveryStatus({ isDeliverable: true, message: 'Delivery available at your location' });
      // } else {
      //   setDeliveryStatus({ isDeliverable: false, message: 'Sorry, currently not delivered to this pincode. Try another pincode.' });
      // }
      
      // Mock data - all pincodes are deliverable for now
      const mockDeliverablePincodes = ['110001', '400001', '700001', '600001', '500001'];
      
      // You can implement your own logic here
      const isDeliverable = true; // Set to false for testing non-deliverable pincodes
      // const isDeliverable = mockDeliverablePincodes.includes(pincode);
      
      if (isDeliverable) {
        setDeliveryStatus({
          isDeliverable: true,
          message: `Delivery available at PIN ${pincode}`,
          estimatedDays: '3-5 business days'
        });
      } else {
        setDeliveryStatus({
          isDeliverable: false,
          message: `Sorry, currently not delivered to PIN ${pincode}. Try another pincode.`
        });
      }
      
    } catch (err) {
      console.error('Error checking pincode:', err);
      setError('Failed to check delivery availability. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkDeliveryAvailability();
    }
  };

  // If product is out of stock, show out of stock message
  if (isOutOfStock) {
    return (
      <div className="bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-950 rounded-full">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-black dark:text-white text-lg">Out of Stock</h3>
            <p className="text-black/60 dark:text-white/60 text-sm">
              This product is currently out of stock. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 dark:bg-red-950 rounded-full">
          <Truck size={20} className="text-red-500" />
        </div>
        <h3 className="font-bold text-black dark:text-white text-lg">Check Delivery Availability</h3>
      </div>
      
      <p className="text-black/60 dark:text-white/60 text-sm mb-4">
        Enter your pincode to check if we deliver to your location
      </p>
      
      {/* Pincode Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MapPin size={18} className="text-black/40 dark:text-white/40" />
          </div>
          <input
            type="text"
            value={pincode}
            onChange={handlePincodeChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter 6-digit pincode"
            maxLength="6"
            className="w-full pl-10 pr-3 py-3 bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-black dark:text-white"
          />
          {pincode.length > 0 && (
            <div 
            onClick={() =>setPincode('')}
            className='absolute right-3 top-1/2 -translate-y-1/2'>
            <X size={18} className="text-black dark:text-white cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-all"/>
          </div>
           )}
        </div>
        <button
          onClick={checkDeliveryAvailability}
          disabled={isChecking || pincode.length !== 6}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isChecking || pincode.length !== 6
              ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed text-gray-500'
              : 'bg-red-500 text-white hover:bg-red-700 hover:shadow-md hover:shadow-red-600 cursor-pointer'
          }`}
        >
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Checking...
            </>
          ) : (
            <>
              <Truck size={18} />
              Check
            </>
          )}
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {/* Delivery Status */}
      {deliveryStatus && (
        <div className={`mt-4 p-4 rounded-xl ${
          deliveryStatus.isDeliverable 
            ? 'bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900'
            : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900'
        }`}>
          <div className="flex items-start gap-3">
            {deliveryStatus.isDeliverable ? (
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                deliveryStatus.isDeliverable 
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }`}>
                {deliveryStatus.message}
              </p>
              {deliveryStatus.isDeliverable && deliveryStatus.estimatedDays && (
                <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                  Estimated delivery: {deliveryStatus.estimatedDays}
                </p>
              )}
              {deliveryStatus.isDeliverable && (
                <p className="text-xs text-black/50 dark:text-white/50 mt-2 flex items-center gap-1">
                  <Truck size={12} />
                  Free shipping on orders above ₹999
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Help Text */}
      <p className="text-xs text-black/40 dark:text-white/40 mt-4">
        Enter a valid 6-digit pincode. We deliver to most locations across India.
      </p>
    </div>
  );
};

export default CheckPin;