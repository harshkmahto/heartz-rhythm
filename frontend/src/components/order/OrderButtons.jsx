import React, { useState } from 'react';

const OrderButtons = ({ 
    cartItems, 
    selectedAddress, 
    selectedPaymentMethod, 
    totals, 
    appliedCoupon, 
    onPlaceOrder,
    isLoading = false
}) => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);

    const isDisabled = !cartItems || cartItems.length === 0 || !selectedAddress || isLoading;

    const handleClick = async () => {
        if (isDisabled) return;
        
        setShowVideo(true);
        setVideoPlaying(true);
        
        setTimeout(() => {
            setVideoPlaying(false);
            setShowVideo(false);
            onPlaceOrder();
        }, 8000);
    };

    if (showVideo && videoPlaying) {
        return (
            <div className="w-full">
                <div className="relative w-full">
                    <video
                        src="/vid/Delivery_box.mp4"
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl"
                        style={{ height: '56px' }}
                        onEnded={() => {
                            setVideoPlaying(false);
                            setShowVideo(false);
                            onPlaceOrder();
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <button
                onClick={handleClick}
                disabled={isDisabled}
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                className={`
                    w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
                    ${!isDisabled 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-95' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                `}
            >
                {isLoading ? "Processing..." : "Place Order"}
            </button>
            
            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Creating your order...
                    </p>
                </div>
            )}
            
            {!isLoading && isDisabled && (
                <p className="text-xs text-red-500 text-center mt-3">
                    {!cartItems || cartItems.length === 0 
                        ? "Your cart is empty" 
                        : "Please select a delivery address"}
                </p>
            )}
        </div>
    );
};

export default OrderButtons;