import React, { useState, useEffect } from 'react';
import { Percent, X, CheckCircle, AlertCircle, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { couponApplied, getProductCoupon } from '../../utils/product.apiRequest';

const CouponSection = ({ onApplyCoupon, appliedCoupon, onRemoveCoupon, items }) => {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [showAllCoupons, setShowAllCoupons] = useState(false);
    const [fetchingCoupons, setFetchingCoupons] = useState(false);

    // Fetch available coupons for all products in checkout
    useEffect(() => {
        if (items && items.length > 0) {
            fetchAvailableCoupons();
        }
    }, [items]);

    const fetchAvailableCoupons = async () => {
        setFetchingCoupons(true);
        const coupons = [];
        
        for (const item of items) {
            const productId = item.product?._id || item.product;
            if (!productId) continue;
            
            try {
                const response = await getProductCoupon(productId);
                if (response.success && response.data) {
                    // Add product info to coupon
                    coupons.push({
                        ...response.data,
                        productId: productId,
                        productTitle: item.title,
                        productBrand: item.brand
                    });
                }
            } catch (err) {
                console.error(`Failed to fetch coupon for product ${productId}:`, err);
            }
        }
        
        // Remove duplicates based on coupon code
        const uniqueCoupons = coupons.filter((coupon, index, self) =>
            index === self.findIndex((c) => c.code === coupon.code)
        );
        
        setAvailableCoupons(uniqueCoupons);
        setFetchingCoupons(false);
    };

    const handleApplyCoupon = async (code) => {
        const couponToApply = code || couponCode;
        
        if (!couponToApply.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        if (!items || items.length === 0) {
            setError('No items in checkout');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Find which product this coupon applies to
            let matchedProduct = null;
            let discountData = null;

            // Check each product in cart for matching coupon
            for (const item of items) {
                const productId = item.product?._id || item.product;
                if (!productId) continue;

                try {
                    const response = await couponApplied(productId, { couponCode: couponToApply });
                    if (response.success) {
                        matchedProduct = item;
                        discountData = response.data;
                        break;
                    }
                } catch (err) {
                    continue;
                }
            }

            if (!matchedProduct || !discountData) {
                setError('Invalid coupon code for items in your cart');
                return;
            }

            const { discountType, discountValue, couponCode: appliedCode } = discountData;
            
            // Calculate total cart value
            const totalCartValue = items.reduce((sum, item) => {
                const price = item.finalPrice || item.price || 0;
                const quantity = item.quantity || 1;
                return sum + (price * quantity);
            }, 0);
            
            // Calculate actual discount amount
            let discountAmount = 0;
            if (discountType === 'percentage') {
                discountAmount = (totalCartValue * discountValue) / 100;
            } else {
                discountAmount = Math.min(discountValue, totalCartValue);
            }

            setSuccess(`Coupon applied! You saved ₹${discountAmount.toLocaleString()}`);
            onApplyCoupon(appliedCode, discountAmount);
            setCouponCode('');
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Coupon error:', err);
            setError(err.message || 'Invalid coupon code');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        onRemoveCoupon();
        setCouponCode('');
        setSuccess(null);
        setError(null);
    };

    // Get discount display text
    const getDiscountText = (coupon) => {
        if (coupon.type === 'percentage') {
            return `${coupon.value}% OFF`;
        } else {
            return `₹${coupon.value} OFF`;
        }
    };

    // Get product display text
    const getProductText = (coupon) => {
        if (availableCoupons.length === 1) {
            return `on ${coupon.productTitle}`;
        }
        return `on ${coupon.productBrand}`;
    };

    return (
        <div className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
                <Percent size={20} className="text-red-500" />
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Apply Coupon</h3>
            </div>

            {appliedCoupon ? (
                // Show applied coupon
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-500 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-500" />
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-400">
                                    Coupon Applied!
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-500">
                                    {appliedCoupon.code} - Saved ₹{appliedCoupon.discountValue.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="p-1 hover:bg-green-200 dark:hover:bg-green-900 rounded-full transition-colors"
                        >
                            <X size={16} className="text-green-600 dark:text-green-400 cursor-pointer" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Coupon input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors uppercase"
                            disabled={loading}
                        />
                        <button
                            onClick={() => handleApplyCoupon()}
                            disabled={loading || !couponCode.trim()}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Applying...' : 'Apply'}
                        </button>
                    </div>

                    {/* Available Coupons Section */}
                    {availableCoupons.length > 0 && (
                        <div className="pt-2">
                            <button
                                onClick={() => setShowAllCoupons(!showAllCoupons)}
                                className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2 ">
                                    <Tag size={14} />
                                    <span>{availableCoupons.length} coupon(s) available</span>
                                </div>
                                {showAllCoupons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            
                            {showAllCoupons && (
                                <div className="mt-3 space-y-2">
                                    {availableCoupons.map((coupon, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-3 hover:border-red-500 transition-all cursor-pointer"
                                            onClick={() => handleApplyCoupon(coupon.code)}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">
                                                        {coupon.code}
                                                    </span>
                                                    <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                                                        {getDiscountText(coupon)}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleApplyCoupon(coupon.code);
                                                    }}
                                                    className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {coupon.description} {getProductText(coupon)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {fetchingCoupons && (
                        <div className="flex items-center justify-center py-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                            <span className="text-xs text-gray-500 ml-2">Loading available coupons...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-xl">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 text-green-500 text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-xl">
                            <CheckCircle size={16} />
                            <span>{success}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CouponSection;