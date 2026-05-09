import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, CheckCircle2, ShieldCheck, Truck, Package, ShoppingBag, Percent, CircleDollarSign, LucideIndianRupee } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ShowCaseSection/Buttons';
import OrderButtons from '../../components/order/OrderButtons';
import CouponSection from '../../components/order/CouponSection';
import SelectedAddress from '../../components/order/AddressSection';

const Checkout = () => {
    const { cartItems, loading } = useCart();
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const calculateTotals = () => {
        if (!cartItems || cartItems.length === 0) {
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

        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (item.finalPrice * item.quantity);
        }, 0);

        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const shipping = 49;
        const platformFee = 12;
        const totalBeforeDiscount = subtotal + shipping + platformFee;
        const discountAmount = discount > 0 ? discount : 0;
        const sellingPrice = totalBeforeDiscount - discountAmount;

        return {
            subtotal,
            totalItems,
            shipping,
            platformFee,
            totalBeforeDiscount,
            discountAmount,
            sellingPrice: sellingPrice < 0 ? 0 : sellingPrice
        };
    };

    const totals = calculateTotals();

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

    const handlePlaceOrder = () => {
        const orderData = {
            items: cartItems,
            address: selectedAddress,
            paymentMethod: selectedPaymentMethod,
            totals: totals,
            coupon: appliedCoupon,
            orderDate: new Date().toISOString()
        };
        console.log('Order placed:', orderData);
        
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        navigate('/order-confirmation');
    };

    if (loading) {
        return (
            <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white w-full min-h-screen">
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
                            
                            {cartItems && cartItems.length > 0 ? (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-5 flex gap-5 hover:border-red-500 transition-all">
                                            <div 
                                            onClick={() => navigate(`/product/details/${item.category}/${item.product._id}`)}
                                            className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 overflow-hidden cursor-pointer">
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
                                                        <span className="text-gray-900 dark:text-white font-bold">₹{item.finalPrice.toLocaleString()}</span>
                                                        {item.mrp > item.finalPrice && (
                                                            <span className="text-sm text-gray-500 line-through">₹{item.mrp.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-red-500 font-bold text-lg">
                                                            ₹{(item.finalPrice * item.quantity).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
                                    <ShoppingBag size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
                                    <Link to="/shop" className="inline-block bg-red-500 px-6 py-3 rounded-xl font-bold text-white hover:bg-red-600 transition-colors">
                                        Browse Shop
                                    </Link>
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
                            />
                            
                            <div className="bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-2xl p-6 md:p-8 flex flex-col gap-6 mt-6 shadow-xl">
                                <h2 className="font-headline text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">Summary</h2>
                                
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
                                            className={`w-full rounded-xl border-2 p-4 flex items-center justify-center gap-3 transition-all ${
                                                selectedPaymentMethod === 'online'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md'
                                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-300 dark:hover:border-red-900 hover:bg-red-500 dark:hover:bg-red-950 cursor-pointer'
                                            }`}
                                        >
                                            <CreditCard size={24} className={selectedPaymentMethod === 'online' ? 'text-red-500' : 'text-gray-500'} />
                                            <span className={`font-bold text-sm ${selectedPaymentMethod === 'online' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                Online Payment
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedPaymentMethod('cod')}
                                            className={`w-full rounded-xl border-2 p-4 flex items-center justify-center gap-3 transition-all ${
                                                selectedPaymentMethod === 'cod'
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md'
                                                    : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-300 dark:hover:border-red-900 hover:bg-red-500 dark:hover:bg-red-950 cursor-pointer'
                                            }`}
                                        >
                                            <LucideIndianRupee size={24} className={selectedPaymentMethod === 'cod' ? 'text-red-500' : 'text-gray-500'} />
                                            <span className={`font-bold text-sm ${selectedPaymentMethod === 'cod' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                Cash on Delivery
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                
                                <OrderButtons 
                                    cartItems={cartItems}
                                    selectedAddress={selectedAddress}
                                    selectedPaymentMethod={selectedPaymentMethod}
                                    totals={totals}
                                    appliedCoupon={appliedCoupon}
                                    onPlaceOrder={handlePlaceOrder}
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