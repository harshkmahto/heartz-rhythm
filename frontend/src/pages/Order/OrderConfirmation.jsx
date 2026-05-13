import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Package, Truck, MapPin, CreditCard, IndianRupee, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OrderConfirmation = () => {
    const [status, setStatus] = useState('loading');
    const [orderData, setOrderData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        // Get order data from location state (passed from Checkout)
        const orderInfo = location.state?.orderData;
        
        console.log('OrderConfirmation received data:', orderInfo);
        
        if (orderInfo && orderInfo.orderId) {
            // Order already created - just display the success state
            setStatus('success');
            setOrderData(orderInfo);
            
            // Redirect to my orders after 8 seconds
            const timer = setTimeout(() => {
                navigate('/my-orders');
            }, 8000);
            
            return () => clearTimeout(timer);
        } else if (orderInfo && orderInfo.checkoutId) {
            // This case shouldn't happen with the new flow, but keep for backward compatibility
            setStatus('failed');
            setErrorMessage('Invalid order data. Please contact support.');
            setTimeout(() => {
                navigate('/checkout');
            }, 8000);
        } else {
            // No order data found
            setStatus('failed');
            setErrorMessage('No order information found. Your order may have been placed successfully. Please check My Orders.');
            setTimeout(() => {
                navigate('/my-orders');
            }, 8000);
        }
    }, [location.state, navigate]);

    // Loading state (should rarely be seen now)
    if (status === 'loading') {
        return (
            <div className="bg-gray-50 dark:bg-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Success state
    if (status === 'success' && orderData) {
        return (
            <div className="bg-gray-50 dark:bg-black min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-black border border-green-500 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Order Placed Successfully! 🎉
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for shopping with us!
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6 text-left">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Order ID:</span>
                            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                                {orderData.orderId}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount:</span>
                            <span className="text-lg font-bold text-red-500">
                                ₹{orderData.totalPrice?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                                {orderData.paymentType === 'cod' ? 'Cash on Delivery' : 
                                 orderData.paymentType === 'online' ? 'Online Payment' : orderData.paymentType}
                            </span>
                        </div>
                        {orderData.paymentStatus && orderData.paymentType === 'online' && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Status:</span>
                                <span className={`text-sm font-semibold ${
                                    orderData.paymentStatus === 'success' ? 'text-green-500' :
                                    orderData.paymentStatus === 'pending_review' ? 'text-yellow-500' :
                                    'text-red-500'
                                }`}>
                                    {orderData.paymentStatus === 'success' ? 'Payment Successful' :
                                     orderData.paymentStatus === 'pending_review' ? 'Pending Verification' :
                                     orderData.paymentStatus}
                                </span>
                            </div>
                        )}
                        {orderData.paymentId && (
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Payment ID:</span>
                                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate ml-2">
                                    {orderData.paymentId}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <Clock size={16} />
                        <span>Redirecting to My Orders in 8 seconds...</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                        <div className="bg-green-500 h-1.5 rounded-full animate-progress"></div>
                    </div>
                    
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
                    >
                        Go to My Orders Now →
                    </button>
                </div>
            </div>
        );
    }

    // Failed state
    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-black border border-red-500 rounded-2xl p-8 text-center shadow-2xl">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                        <XCircle size={48} className="text-red-500" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Order Status Unknown
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {errorMessage || "We couldn't confirm your order status. Please check My Orders for updates."}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Clock size={16} />
                    <span>Redirecting to My Orders in 8 seconds...</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                    <div className="bg-red-500 h-1.5 rounded-full animate-progress"></div>
                </div>
                
                <button
                    onClick={() => navigate('/my-orders')}
                    className="text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
                >
                    Go to My Orders →
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;