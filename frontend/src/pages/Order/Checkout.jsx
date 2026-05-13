import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, CheckCircle2, ShieldCheck, Truck, Package, ShoppingBag, Percent, LucideIndianRupee } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import OrderButtons from '../../components/order/OrderButtons';
import CouponSection from '../../components/order/CouponSection';
import SelectedAddress from '../../components/order/AddressSection';
import { getMyCheckout, createCheckout, onlineCreateOrder, verifyPayment, createOrder } from '../../utils/order.apiRequest';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ShowCaseSection/Loader';
import toast from 'react-hot-toast';

const PaymentHandler = ({ 
  razorpayOptions, 
  onSuccess, 
  onFailure, 
  onClose,
  isOpen 
}) => {
  const razorpayRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && razorpayOptions) {
      try {
        const options = {
          ...razorpayOptions,
          handler: async (response) => {
            await onSuccess(response);
          },
          modal: {
            ondismiss: () => {
              if (onClose) onClose();
            }
          }
        };

        razorpayRef.current = new window.Razorpay(options);
        razorpayRef.current.open();
      } catch (error) {
        console.error('Error opening Razorpay:', error);
        onFailure(error);
      }
    }

    return () => {
      if (razorpayRef.current) {
        razorpayRef.current.close();
      }
    };
  }, [isOpen, razorpayOptions, onSuccess, onFailure, onClose]);

  return null;
};

const Checkout = () => {
    const { cartItems, loading: cartLoading, fetchCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [checkoutData, setCheckoutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creatingCheckout, setCreatingCheckout] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [razorpayConfig, setRazorpayConfig] = useState(null);
    const [currentCheckoutId, setCurrentCheckoutId] = useState(null);

    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCheckoutData();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && cartItems.length > 0 && !processingPayment) {
            updateCheckout();
        }
    }, [selectedAddress, appliedCoupon]);

    const fetchCheckoutData = async () => {
        try {
            setLoading(true);
            const response = await getMyCheckout();
            if (response.success && response.data) {
                setCheckoutData(response.data);
                setCurrentCheckoutId(response.data._id);
                if (response.data.address) {
                    setSelectedAddress(response.data.address);
                }
                if (response.data.discount && response.data.discountCode) {
                    setDiscount(response.data.discountValue);
                    setAppliedCoupon({
                        code: response.data.discountCode,
                        discountValue: response.data.discountValue
                    });
                }
            }
        } catch (error) {
            await updateCheckout();
        } finally {
            setLoading(false);
        }
    };

    const updateCheckout = async () => {
        try {
            setCreatingCheckout(true);
            const checkoutPayload = {
                addressId: selectedAddress?._id || null,
                discountCode: appliedCoupon?.code || null,
                discountValue: appliedCoupon?.discountValue || 0
            };
            
            const response = await createCheckout(checkoutPayload);
            if (response.success && response.data) {
                setCheckoutData(response.data);
                setCurrentCheckoutId(response.data._id);
            }
        } catch (error) {
            toast.error('Failed to update checkout');
        } finally {
            setCreatingCheckout(false);
        }
    };

    const calculateTotals = () => {
        if (!checkoutData) {
            return {
                subtotal: 0,
                totalItems: 0,
                shipping: 49,
                platformFee: 12,
                totalBeforeDiscount: 0,
                discountAmount: 0,
                sellingPrice: 0
            };
        }

        const subtotal = checkoutData.subtotal || 0;
        const totalItems = checkoutData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const shipping = checkoutData.shippingCharge || 49;
        const platformFee = checkoutData.platformFee || 12;
        const discountAmount = checkoutData.discountValue || 0;
        const sellingPrice = checkoutData.totalPrice || 0;

        return {
            subtotal,
            totalItems,
            shipping,
            platformFee,
            totalBeforeDiscount: subtotal + shipping + platformFee,
            discountAmount,
            sellingPrice
        };
    };

    const totals = calculateTotals();

    const handleOnlinePayment = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        const checkoutIdToUse = currentCheckoutId || checkoutData?._id;
        
        if (!checkoutIdToUse) {
            toast.error('Checkout data not found. Please refresh the page.');
            return;
        }

        setProcessingPayment(true);

        try {
            const razorpayOrderResponse = await onlineCreateOrder({ 
                checkoutId: checkoutIdToUse
            });
            
            if (!razorpayOrderResponse.success) {
                throw new Error(razorpayOrderResponse.message || 'Failed to create payment order');
            }

            const { razorpayOrderId, amount, currency, key } = razorpayOrderResponse.data;

            const options = {
                key: key,
                amount: amount,
                currency: currency,
                name: 'Heartz Rhythm',
                description: `Order Payment - ${razorpayOrderId}`,
                order_id: razorpayOrderId,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                notes: {
                    address: selectedAddress?.address || '',
                    city: selectedAddress?.city || '',
                    checkoutId: checkoutIdToUse
                },
                theme: {
                    color: '#ef4444'
                },
                modal: {
                    escape: false,
                    ondismiss: () => {
                        setProcessingPayment(false);
                        setPaymentModalOpen(false);
                        toast.warning('Payment was cancelled');
                    }
                }
            };

            setRazorpayConfig(options);
            setPaymentModalOpen(true);
            
        } catch (error) {
            toast.error(error.message || 'Failed to initiate payment. Please try again.');
            setProcessingPayment(false);
        }
    };

    const handlePaymentSuccess = async (paymentResponse) => {
        try {
            setPaymentModalOpen(false);
            
            toast.info('Payment received! Verifying your order...');
            
            const checkoutIdToUse = currentCheckoutId || checkoutData?._id;
            
            const verificationResponse = await verifyPayment({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                checkoutId: checkoutIdToUse
            });

            if (verificationResponse.success) {
                toast.success('Payment successful! Order placed.');
                await fetchCart();
                
                navigate('/order-confirmation', {
                    state: { 
                        orderData: {
                            orderId: verificationResponse.data.orderId,
                            totalPrice: verificationResponse.data.totalPrice,
                            paymentType: 'online',
                            paymentId: verificationResponse.data.paymentId,
                            orderDetails: verificationResponse.data.order,
                            paymentStatus: verificationResponse.data.paymentStatus,
                            razorpayDetails: verificationResponse.data.razorpayDetails
                        }
                    },
                    replace: true
                });
            } else {
                if (verificationResponse.data?.paymentStatus === 'review') {
                    toast.warning('Payment received but verification is pending. Your order will be confirmed shortly.');
                    
                    navigate('/order-confirmation', {
                        state: { 
                            orderData: {
                                orderId: verificationResponse.data.orderId,
                                totalPrice: verificationResponse.data.totalPrice,
                                paymentType: 'online',
                                paymentStatus: 'pending_review',
                                orderDetails: verificationResponse.data.order
                            }
                        },
                        replace: true
                    });
                } else {
                    throw new Error(verificationResponse.message || 'Payment verification failed');
                }
            }
        } catch (error) {
            toast.error(error.message || 'Payment verification failed. Please contact support.');
            setProcessingPayment(false);
        }
    };

    const handlePaymentFailure = (error) => {
        setPaymentModalOpen(false);
        setProcessingPayment(false);
        toast.error(error.message || 'Payment failed. Please try again.');
    };

    const handleCODOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        const checkoutIdToUse = currentCheckoutId || checkoutData?._id;
        
        if (!checkoutIdToUse) {
            toast.error('Checkout data not found. Please refresh the page.');
            return;
        }

        setProcessingPayment(true);

        try {
            const orderData = {
                checkoutId: checkoutIdToUse,
                paymentType: 'cod'
            };

            const response = await createOrder(orderData);

            if (response.success) {
                toast.success('Order placed successfully!');
                await fetchCart();
                
                navigate('/order-confirmation', {
                    state: { 
                        orderData: {
                            orderId: response.data.orderId,
                            totalPrice: response.data.totalPrice,
                            paymentType: 'cod',
                            orderDetails: response.data.order
                        }
                    },
                    replace: true
                });
            } else {
                throw new Error(response.message || 'Order creation failed');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create order. Please try again.');
            setProcessingPayment(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        if (selectedPaymentMethod === 'online') {
            await handleOnlinePayment();
        } else {
            await handleCODOrder();
        }
    };

    const handleApplyCoupon = (code, discountValue) => {
        setDiscount(discountValue);
        setAppliedCoupon({ code, discountValue });
    };

    const handleRemoveCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    if (cartLoading || loading) {
        return (
            <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white w-full min-h-screen">
                <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-12 text-center">
                        <ShoppingBag size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
                        <Link to="/shop" className="inline-block bg-red-500 px-6 py-3 rounded-xl font-bold text-white hover:bg-red-600 transition-colors">
                            Browse Shop
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white w-full min-h-screen">
            <PaymentHandler
                isOpen={paymentModalOpen}
                razorpayOptions={razorpayConfig}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                onClose={() => {
                    setPaymentModalOpen(false);
                    setProcessingPayment(false);
                }}
            />
            
            <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <header className="mb-16">
                    <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 italic text-gray-900 dark:text-white">
                        Checkout.
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-body max-w-2xl text-lg">
                        Review your items and complete your purchase.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="flex items-center gap-4 px-2 overflow-x-auto whitespace-nowrap">
                            <div className="flex items-center gap-2 text-red-500 font-bold">
                                <span className="min-w-8 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                                    <CheckCircle2 size={16} />
                                </span>
                                <span className="text-sm uppercase tracking-widest hidden sm:inline">Cart</span>
                            </div>
                            <div className="h-px flex-1 min-w-[30px] bg-gray-300 dark:bg-gray-700"></div>
                            <div className="flex items-center gap-2 text-red-500 font-bold">
                                <span className="min-w-8 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                                    <CheckCircle2 size={16} />
                                </span>
                                <span className="text-sm uppercase tracking-widest hidden sm:inline">Checkout</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                <Package size={28} className="text-red-500" />
                                Order Items ({totals.totalItems})
                            </h2>
                            
                            {checkoutData?.items && checkoutData.items.length > 0 ? (
                                <div className="space-y-4">
                                    {checkoutData.items.map((item, index) => (
                                        <div key={index} className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-5 flex gap-5 hover:border-red-500 transition-all">
                                            <div 
                                                onClick={() => navigate(`/product/details/${item.category}/${item.product?._id}`)}
                                                className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 overflow-hidden cursor-pointer"
                                            >
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag size={32} className="text-gray-400 dark:text-gray-600" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                    {item.colorName} • {item.brand}
                                                </p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                                                        <span className="text-gray-900 dark:text-white font-bold">₹{item.finalPrice?.toLocaleString()}</span>
                                                        {item.mrp > item.finalPrice && (
                                                            <span className="text-sm text-gray-500 line-through">₹{item.mrp?.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-red-500 font-bold text-lg">
                                                            ₹{item.sellingPrice?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-12 text-center">
                                    <ShoppingBag size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">Loading items...</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                <MapPin size={28} className="text-red-500" />
                                Delivery Address
                            </h2>
                            <SelectedAddress onAddressSelect={handleAddressSelect} selectedAddress={selectedAddress} />
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <CouponSection 
                                onApplyCoupon={handleApplyCoupon} 
                                appliedCoupon={appliedCoupon}
                                onRemoveCoupon={handleRemoveCoupon}
                                items={checkoutData?.items}
                            />
                            
                            <div className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-6 md:p-8 flex flex-col gap-6 mt-6 shadow-xl">
                                <h2 className="font-headline text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">Summary</h2>
                                
                                {creatingCheckout && (
                                    <div className="text-center py-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                                        <p className="text-xs text-gray-500 mt-2">Updating...</p>
                                    </div>
                                )}
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal ({totals.totalItems} items)</span>
                                        <span className="text-gray-900 dark:text-white font-bold">₹{totals.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Shipping (Insured)</span>
                                        <span className="text-gray-900 dark:text-white font-bold">₹{totals.shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                                        <span className="text-gray-900 dark:text-white font-bold">₹{totals.platformFee.toLocaleString()}</span>
                                    </div>
                                    
                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-red-200 dark:border-red-800">
                                            <div className="flex items-center gap-2">
                                                <Percent size={14} className="text-green-500" />
                                                <span className="text-green-500">Discount ({appliedCoupon.code})</span>
                                            </div>
                                            <span className="text-green-500 font-bold">-₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 mt-2 border-t-2 border-red-500 flex justify-between items-center">
                                        <span className="text-gray-900 dark:text-white font-black text-xl italic uppercase">Total</span>
                                        <span className="text-red-500 font-black text-2xl tracking-tighter"> 
                                            ₹{totals.sellingPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 mt-2">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Payment Method</p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setSelectedPaymentMethod('online')}
                                            disabled={processingPayment}
                                            className={`w-full rounded-xl border-2 p-4 flex items-center justify-center gap-3 transition-all ${
                                                selectedPaymentMethod === 'online'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md'
                                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-300 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer'
                                            } ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <CreditCard size={24} className={selectedPaymentMethod === 'online' ? 'text-red-500' : 'text-gray-500'} />
                                            <span className={`font-bold text-sm ${selectedPaymentMethod === 'online' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                Online Payment
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedPaymentMethod('cod')}
                                            disabled={processingPayment}
                                            className={`w-full rounded-xl border-2 p-4 flex items-center justify-center gap-3 transition-all ${
                                                selectedPaymentMethod === 'cod'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md'
                                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-300 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer'
                                            } ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <LucideIndianRupee size={24} className={selectedPaymentMethod === 'cod' ? 'text-red-500' : 'text-gray-500'} />
                                            <span className={`font-bold text-sm ${selectedPaymentMethod === 'cod' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                Cash on Delivery
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                
                                <OrderButtons 
                                    cartItems={checkoutData?.items || []}
                                    selectedAddress={selectedAddress}
                                    selectedPaymentMethod={selectedPaymentMethod}
                                    totals={totals}
                                    appliedCoupon={appliedCoupon}
                                    onPlaceOrder={handlePlaceOrder}
                                    isLoading={creatingCheckout || processingPayment}
                                />
                                
                                <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold pt-2">
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck size={14} className="text-red-500" />
                                        Secure Checkout
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Truck size={14} className="text-red-500" />
                                        Insured Delivery
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;