import mongoose from "mongoose";
import AddressModel from "../models/address.model.js";
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import Checkout from "../models/checkout.model.js";
import Cart from "../models/cart.model.js";
import config from "../config/config.js";
import razorpay from "../service/razorpay.service.js";
import crypto from "crypto";

const verifyAndUpdateStock = async (checkout, session) => {
    const orderItems = [];
    let subtotal = 0;
    let itemCount = 0;

    for (const checkoutItem of checkout.items) {
        const product = await ProductModel.findById(checkoutItem.product._id).session(session);
        
        if (!product) {
            throw new Error(`Product not found: ${checkoutItem.title}`);
        }

        const variant = product.variants.find(
            v => v._id.toString() === checkoutItem.variantId.toString()
        );

        if (!variant) {
            throw new Error(`Variant not found for product: ${checkoutItem.title}`);
        }

        if (variant.stock < checkoutItem.quantity) {
            throw new Error(`Insufficient stock for ${checkoutItem.title} - ${checkoutItem.colorName}. Available: ${variant.stock}`);
        }

        const sellerId = product.seller;

        orderItems.push({
            product: product._id,
            seller: sellerId,
            title: checkoutItem.title,
            thumbnail: checkoutItem.thumbnail,
            brand: checkoutItem.brand,
            category: checkoutItem.category,
            subCategory: checkoutItem.subCategory,
            colorName: checkoutItem.colorName,
            colorCode: checkoutItem.colorCode,
            quantity: checkoutItem.quantity,
            mrp: checkoutItem.mrp,
            finalPrice: checkoutItem.finalPrice,
            sellingPrice: checkoutItem.sellingPrice,
            status: {
                status: 'pending'
            }
        });

        subtotal += checkoutItem.sellingPrice;
        itemCount += checkoutItem.quantity;

        variant.stock -= checkoutItem.quantity;
        product.totalStock -= checkoutItem.quantity;
        
        if (variant.stock === 0) {
            variant.isAvailable = false;
        }
        
        await product.save({ session });
    }

    return { orderItems, subtotal, itemCount };
};

export const createOrder = async (req, res) => {
    try {   
        const userId = req.user.id; 
        const { 
            checkoutId,      
            paymentType = 'cod'
        } = req.body;

        const checkout = await Checkout.findOne({ 
            _id: checkoutId, 
            user: userId,
            isActive: true
        }).populate('items.product');

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found or expired"
            });
        }

        if (!checkout.address) {
            return res.status(400).json({
                success: false,
                message: "Please select a delivery address"
            });
        }

        const address = await AddressModel.findOne({
            _id: checkout.address,
            user: userId
        });
        
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { orderItems, subtotal, itemCount } = await verifyAndUpdateStock(checkout, session);

            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const orderId = `ORD${year}${month}${random}`;

            const shippingCharge = checkout.shippingCharge || 49;
            const platformFee = checkout.platformFee || 12;
            const discountValue = checkout.discountValue || 0;
            const totalPrice = subtotal + shippingCharge + platformFee - discountValue;

            if (paymentType === 'cod') {
                if (totalPrice > 10000) {
                    throw new Error("Cash on Delivery not available for orders above ₹10,000");
                }
            }

            const order = await OrderModel.create([{
                orderId: orderId,
                user: userId,
                billingAddress: checkout.address,
                item: orderItems,
                itemCount: itemCount,
                subTotal: subtotal,
                shippingCharge: shippingCharge,
                platformFee: platformFee,
                discount: checkout.discount,
                discountValue: discountValue,
                discountCode: checkout.discountCode,
                totalPrice: totalPrice,
                paymentType: paymentType,
                paymentStatus: paymentType === 'cod' ? 'pending' : 'success',
                orderStatus: 'placed'
            }], { session });

            checkout.isActive = false;
            await checkout.save({ session });

            await Cart.deleteMany({ user: userId }).session(session);

            await session.commitTransaction();

            const populatedOrder = await OrderModel.findById(order[0]._id)
                .populate('user', 'name email phone')
                .populate('billingAddress')
                .populate('item.product', 'title thumbnail');

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                data: {
                    order: populatedOrder,
                    orderId: order[0].orderId,
                    totalPrice: totalPrice,
                    paymentType: paymentType
                }
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const onlineCreateOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { checkoutId } = req.body;

        const checkout = await Checkout.findOne({ 
            _id: checkoutId, 
            user: userId,
            isActive: true
        }).populate('items.product');

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found or expired"
            });
        }

        if (!checkout.address) {
            return res.status(400).json({
                success: false,
                message: "Please select a delivery address"
            });
        }

        for (const checkoutItem of checkout.items) {
            const product = await ProductModel.findById(checkoutItem.product._id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${checkoutItem.title}`
                });
            }

            const variant = product.variants.find(
                v => v._id.toString() === checkoutItem.variantId.toString()
            );

            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: `Variant not found for product: ${checkoutItem.title}`
                });
            }

            if (variant.stock < checkoutItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${checkoutItem.title} - ${checkoutItem.colorName} is out of stock or insufficient quantity. Available: ${variant.stock}`
                });
            }
        }

        const amount = Math.round(checkout.totalPrice * 100);

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
            notes: {
                userId: userId,
                checkoutId: checkoutId
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        checkout.tempRazorpayOrderId = razorpayOrder.id;
        checkout.isActive = true;
        await checkout.save();

        return res.status(200).json({
            success: true,
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: amount,
                currency: "INR",
                key: config.RAZOR_API_KEY
            }
        });

    } catch (error) {
        console.error('Create online order error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            checkoutId
        } = req.body;

        console.log('Verify Payment called with:', { razorpay_order_id, razorpay_payment_id, checkoutId });

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', config.RAZOR_API_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            console.error('Invalid payment signature');
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let checkout = await Checkout.findOne({ 
                _id: checkoutId, 
                user: userId,
                tempRazorpayOrderId: razorpay_order_id
            }).populate('items.product');

            if (!checkout) {
                checkout = await Checkout.findOne({ 
                    _id: checkoutId, 
                    user: userId
                }).populate('items.product');
            }

            if (!checkout) {
                console.error('Checkout not found:', { checkoutId, userId, razorpay_order_id });
                throw new Error("Checkout not found or expired");
            }

            const existingOrder = await OrderModel.findOne({ 
                'razorpayDetails.orderId': razorpay_order_id 
            });
            
            if (existingOrder) {
                console.log('Order already exists for this payment');
                await session.abortTransaction();
                return res.status(200).json({
                    success: true,
                    message: "Order already processed",
                    data: {
                        order: existingOrder,
                        orderId: existingOrder.orderId,
                        totalPrice: existingOrder.totalPrice,
                        paymentType: 'online',
                        paymentId: existingOrder.razorpayDetails?.paymentId,
                        paymentStatus: existingOrder.paymentStatus
                    }
                });
            }

            if (!checkout.address) {
                throw new Error("Please select a delivery address");
            }
            
            const address = await AddressModel.findOne({
                _id: checkout.address,
                user: userId
            });
            
            if (!address) {
                throw new Error("Address not found");
            }

            if (!checkout.isActive && checkout.tempRazorpayOrderId) {
                console.log('Checkout already processed, checking for existing order');
                const existingOrderForCheckout = await OrderModel.findOne({ 
                    'razorpayDetails.orderId': razorpay_order_id 
                });
                
                if (existingOrderForCheckout) {
                    await session.abortTransaction();
                    return res.status(200).json({
                        success: true,
                        message: "Order already processed",
                        data: {
                            order: existingOrderForCheckout,
                            orderId: existingOrderForCheckout.orderId,
                            totalPrice: existingOrderForCheckout.totalPrice,
                            paymentType: 'online',
                            paymentId: existingOrderForCheckout.razorpayDetails?.paymentId,
                            paymentStatus: existingOrderForCheckout.paymentStatus
                        }
                    });
                }
            }

            const { orderItems, subtotal, itemCount } = await verifyAndUpdateStock(checkout, session);

            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const orderId = `ORD${year}${month}${random}`;

            const shippingCharge = checkout.shippingCharge || 49;
            const platformFee = checkout.platformFee || 12;
            const discountValue = checkout.discountValue || 0;
            const totalPrice = subtotal + shippingCharge + platformFee - discountValue;

            let paymentStatus = 'pending';
            let actualPaymentStatus = 'captured';
            
            try {
                const payment = await razorpay.payments.fetch(razorpay_payment_id);
                actualPaymentStatus = payment.status;
                
                if (actualPaymentStatus === 'captured') {
                    paymentStatus = 'success';
                } else if (actualPaymentStatus === 'failed') {
                    paymentStatus = 'failed';
                } else {
                    paymentStatus = 'review';
                }
            } catch (error) {
                console.error('Error fetching payment status:', error);
                paymentStatus = 'review';
            }

            let orderStatus = 'placed';
            let shouldCreateOrder = true;
            let responseMessage = "Order created successfully";

            if (paymentStatus === 'failed') {
                shouldCreateOrder = false;
                responseMessage = "Payment failed. Please try again.";
                
                checkout.paymentFailed = true;
                await checkout.save({ session });
                
                await session.abortTransaction();
                
                return res.status(400).json({
                    success: false,
                    message: "Payment failed. No order was created.",
                    paymentStatus: 'failed'
                });
            } else if (paymentStatus === 'review') {
                orderStatus = 'pending';
                responseMessage = "Payment is being verified. Your order will be confirmed shortly.";
            }

            if (!shouldCreateOrder) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: responseMessage
                });
            }

            const order = await OrderModel.create([{
                orderId: orderId,
                user: userId,
                billingAddress: checkout.address,
                item: orderItems,
                itemCount: itemCount,
                subTotal: subtotal,
                shippingCharge: shippingCharge,
                platformFee: platformFee,
                discount: checkout.discount || false,
                discountValue: discountValue,
                discountCode: checkout.discountCode,
                totalPrice: totalPrice,
                paymentType: 'online',
                paymentStatus: paymentStatus,
                orderStatus: orderStatus,
                razorpayDetails: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    paymentDate: new Date(),
                    paymentStatus: actualPaymentStatus
                }
            }], { session });

            checkout.isActive = false;
            checkout.tempRazorpayOrderId = null;
            await checkout.save({ session });

            await Cart.deleteMany({ user: userId }).session(session);

            await session.commitTransaction();

            const populatedOrder = await OrderModel.findById(order[0]._id)
                .populate('user', 'name email phone')
                .populate('billingAddress')
                .populate('item.product', 'title thumbnail');

            return res.status(201).json({
                success: true,
                message: responseMessage,
                data: {
                    order: populatedOrder,
                    orderId: order[0].orderId,
                    totalPrice: totalPrice,
                    paymentType: 'online',
                    paymentId: razorpay_payment_id,
                    paymentStatus: paymentStatus,
                    razorpayDetails: order[0].razorpayDetails
                }
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Online order creation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get user's orders
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const query = { user: userId };
        if (status) {
            query.orderStatus = status;
        }

        const orders = await OrderModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('billingAddress')
            .populate('item.product', 'title thumbnail');

        const total = await OrderModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalOrders: total,
                    hasNextPage: page < Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single order details
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await OrderModel.findOne({ 
            orderId: orderId,
            user: userId 
        })
            .populate('user', 'name email phone')
            .populate('billingAddress')
            .populate('item.product', 'title thumbnail variants')
            .populate('item.seller', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};





//SELLER 
// SELLER 
export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        // Find orders that contain items from this seller
        const query = { 
            'item.seller': sellerId 
        };
        
        if (status && status !== 'all') {
            query.orderStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await OrderModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email phone')
            .populate('billingAddress');

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    orders: [],
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: 0,
                        totalOrders: 0,
                        hasNextPage: false
                    }
                }
            });
        }

        // Filter items for each order to only show seller's items
        const filteredOrders = orders.map(order => {
            const sellerItems = order.item.filter(item => 
                item.seller && item.seller.toString() === sellerId
            );
            
            // Calculate seller-specific totals
            const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.sellingPrice || 0), 0);
            const sellerItemCount = sellerItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
            
            // Calculate seller's share of shipping and platform fee (proportional)
            const totalOrderValue = order.subTotal || 0;
            const sellerPercentage = totalOrderValue > 0 ? sellerSubtotal / totalOrderValue : 0;
            const sellerShippingCharge = (order.shippingCharge || 0) * sellerPercentage;
            const sellerPlatformFee = (order.platformFee || 0) * sellerPercentage;
            const sellerDiscountValue = (order.discountValue || 0) * sellerPercentage;
            const sellerTotalPrice = sellerSubtotal + sellerShippingCharge + sellerPlatformFee - sellerDiscountValue;
            
            return {
                _id: order._id,
                orderId: order.orderId,
                user: order.user,
                billingAddress: order.billingAddress,
                item: sellerItems,
                itemCount: sellerItemCount,
                subTotal: sellerSubtotal,
                shippingCharge: Math.round(sellerShippingCharge),
                platformFee: Math.round(sellerPlatformFee),
                discount: order.discount,
                discountValue: Math.round(sellerDiscountValue),
                discountCode: order.discountCode,
                totalPrice: Math.round(sellerTotalPrice),
                paymentType: order.paymentType,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });

        const total = await OrderModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                orders: filteredOrders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalOrders: total,
                    hasNextPage: parseInt(page) < Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get seller orders error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getSellerOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sellerId = req.user.id;

        const order = await OrderModel.findOne({ 
            orderId: orderId
        })
            .populate('user', 'name email phone')
            .populate('billingAddress')
            .populate('item.product', 'title thumbnail variants');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Filter only seller's items
        const sellerItems = order.item.filter(item => 
            item.seller && item.seller.toString() === sellerId
        );

        if (sellerItems.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this order"
            });
        }

        // Calculate seller-specific totals
        const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.sellingPrice || 0), 0);
        const sellerItemCount = sellerItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        const totalOrderValue = order.subTotal || 0;
        const sellerPercentage = totalOrderValue > 0 ? sellerSubtotal / totalOrderValue : 0;
        const sellerShippingCharge = (order.shippingCharge || 0) * sellerPercentage;
        const sellerPlatformFee = (order.platformFee || 0) * sellerPercentage;
        const sellerDiscountValue = (order.discountValue || 0) * sellerPercentage;
        const sellerTotalPrice = sellerSubtotal + sellerShippingCharge + sellerPlatformFee - sellerDiscountValue;

        const filteredOrder = {
            _id: order._id,
            orderId: order.orderId,
            user: order.user,
            billingAddress: order.billingAddress,
            item: sellerItems,
            itemCount: sellerItemCount,
            subTotal: sellerSubtotal,
            shippingCharge: Math.round(sellerShippingCharge),
            platformFee: Math.round(sellerPlatformFee),
            discount: order.discount,
            discountValue: Math.round(sellerDiscountValue),
            discountCode: order.discountCode,
            totalPrice: Math.round(sellerTotalPrice),
            paymentType: order.paymentType,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        return res.status(200).json({
            success: true,
            data: filteredOrder
        });

    } catch (error) {
        console.error('Get seller order details error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//ADMIN
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, paymentType, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = {};
        
        if (status && status !== 'all') {
            query.orderStatus = status;
        }
        
        if (paymentType && paymentType !== 'all') {
            query.paymentType = paymentType;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const orders = await OrderModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email phone profilePicture')
            .populate('billingAddress')
            .populate('item.product', 'title thumbnail brand category')
            .populate('item.seller', 'name brandName sellerName sellerEmail  sellerPhone logo');

        const total = await OrderModel.countDocuments(query);

        const ordersWithDetails = orders.map(order => {
            const totalMrp = order.item.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
            const totalSaving = totalMrp - order.subTotal;
            
            const sellerBreakdown = {};
            order.item.forEach(item => {
                const sellerId = item.seller?._id?.toString() || item.seller?.toString();
                if (sellerId) {
                    if (!sellerBreakdown[sellerId]) {
                        sellerBreakdown[sellerId] = {
                            sellerName: item.seller?.businessName || item.seller?.name || 'Unknown',
                            items: [],
                            subtotal: 0,
                            itemCount: 0
                        };
                    }
                    sellerBreakdown[sellerId].items.push({
                        productId: item.product?._id,
                        title: item.title,
                        quantity: item.quantity,
                        sellingPrice: item.sellingPrice,
                        status: item.status
                    });
                    sellerBreakdown[sellerId].subtotal += item.sellingPrice;
                    sellerBreakdown[sellerId].itemCount += item.quantity;
                }
            });

            return {
                _id: order._id,
                orderId: order.orderId,
                user: order.user,
                billingAddress: order.billingAddress,
                items: order.item,
                itemCount: order.itemCount,
                subTotal: order.subTotal,
                totalMrp: totalMrp,
                totalSaving: totalSaving,
                shippingCharge: order.shippingCharge,
                platformFee: order.platformFee,
                discount: order.discount,
                discountValue: order.discountValue,
                discountCode: order.discountCode,
                totalPrice: order.totalPrice,
                paymentType: order.paymentType,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                razorpayDetails: order.razorpayDetails,
                sellerBreakdown: Object.values(sellerBreakdown),
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                orders: ordersWithDetails,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalOrders: total,
                    hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderModel.findOne({ orderId: orderId })
            .populate('user', 'name email phone profilePicture')
            .populate('billingAddress')
            .populate('item.product', 'title thumbnail brand category description')
            .populate('item.seller', 'brandName sellerName sellerEmail  sellerPhone logo');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const totalMrp = order.item.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
        const totalSaving = totalMrp - order.subTotal;

        const sellerBreakdown = {};
        order.item.forEach(item => {
            const sellerId = item.seller?._id?.toString() || item.seller?.toString();
            if (sellerId) {
                if (!sellerBreakdown[sellerId]) {
                    sellerBreakdown[sellerId] = {
                        seller: item.seller,
                        items: [],
                        subtotal: 0,
                        itemCount: 0,
                        totalMrp: 0,
                        totalSaving: 0
                    };
                }
                
                const itemMrp = item.mrp * item.quantity;
                const itemSaving = itemMrp - item.sellingPrice;
                
                sellerBreakdown[sellerId].items.push({
                    productId: item.product?._id,
                    product: item.product,
                    title: item.title,
                    thumbnail: item.thumbnail,
                    brand: item.brand,
                    category: item.category,
                    colorName: item.colorName,
                    colorCode: item.colorCode,
                    quantity: item.quantity,
                    mrp: item.mrp,
                    finalPrice: item.finalPrice,
                    sellingPrice: item.sellingPrice,
                    itemMrp: itemMrp,
                    itemSaving: itemSaving,
                    status: item.status,
                    currentStatus: item.status?.status || 'pending'
                });
                
                sellerBreakdown[sellerId].subtotal += item.sellingPrice;
                sellerBreakdown[sellerId].itemCount += item.quantity;
                sellerBreakdown[sellerId].totalMrp += itemMrp;
                sellerBreakdown[sellerId].totalSaving += itemSaving;
            }
        });

        const timeline = [];
        
        timeline.push({
            status: 'placed',
            date: order.createdAt,
            description: 'Order placed successfully'
        });
        
        if (order.razorpayDetails?.paymentDate) {
            timeline.push({
                status: 'payment_confirmed',
                date: order.razorpayDetails.paymentDate,
                description: `Payment ${order.paymentStatus} via ${order.paymentType}`
            });
        }
        
        const statusHistory = order.statusHistory || [];
        statusHistory.forEach(history => {
            timeline.push({
                status: history.status,
                date: history.date,
                description: history.description || `Order ${history.status}`
            });
        });

        const orderDetails = {
            _id: order._id,
            orderId: order.orderId,
            user: order.user,
            billingAddress: order.billingAddress,
            items: order.item,
            itemCount: order.itemCount,
            subTotal: order.subTotal,
            totalMrp: totalMrp,
            totalSaving: totalSaving,
            savingsPercentage: totalMrp > 0 ? ((totalSaving / totalMrp) * 100).toFixed(2) : 0,
            shippingCharge: order.shippingCharge,
            platformFee: order.platformFee,
            discount: order.discount,
            discountValue: order.discountValue,
            discountCode: order.discountCode,
            totalPrice: order.totalPrice,
            paymentType: order.paymentType,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            razorpayDetails: order.razorpayDetails,
            sellerBreakdown: Object.values(sellerBreakdown),
            timeline: timeline,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            hasCancelledItems: order.hasCancelledItems,
            isRefunded: order.isRefunded,
            refundedAt: order.refundedAt,
            cancelledBy: order.cancelledBy,
            cancelledReason: order.cancelledReason,
            cancelledAt: order.cancelledAt
        };

        return res.status(200).json({
            success: true,
            data: orderDetails
        });

    } catch (error) {
        console.error('Get order details error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, itemStatuses, reason } = req.body;

        const order = await OrderModel.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (orderStatus) {
                const validStatuses = ['placed', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'replaced'];
                if (!validStatuses.includes(orderStatus)) {
                    throw new Error(`Invalid order status: ${orderStatus}`);
                }

                order.orderStatus = orderStatus;
                
                if (!order.statusHistory) {
                    order.statusHistory = [];
                }
                
                order.statusHistory.push({
                    status: orderStatus,
                    date: new Date(),
                    description: `Order status changed to ${orderStatus}`,
                    updatedBy: req.user.id
                });

                if (orderStatus === 'cancelled') {
                    for (const item of order.item) {
                        const product = await ProductModel.findById(item.product).session(session);
                        if (product) {
                            const variant = product.variants.find(
                                v => v._id.toString() === item._id.toString()
                            );
                            if (variant) {
                                variant.stock += item.quantity;
                                product.totalStock += item.quantity;
                                if (!variant.isAvailable && variant.stock > 0) {
                                    variant.isAvailable = true;
                                }
                                await product.save({ session });
                            }
                        }
                        
                        item.status = {
                            status: 'cancelled',
                            cancelledBy: 'admin',
                            cancelledReason: reason || 'Cancelled by admin',
                            cancelledAt: new Date()
                        };
                    }
                    order.hasCancelledItems = true;
                    order.cancelledBy = 'admin';
                    order.cancelledReason = reason || 'Order cancelled by admin';
                    order.cancelledAt = new Date();
                }
            }

            if (itemStatuses && Array.isArray(itemStatuses)) {
                for (const update of itemStatuses) {
                    const item = order.item.id(update.itemId);
                    if (item) {
                        const oldStatus = item.status?.status;
                        
                        item.status = {
                            status: update.status,
                            cancelledBy: update.status === 'cancelled' ? 'admin' : item.status?.cancelledBy,
                            cancelledReason: update.status === 'cancelled' ? (update.reason || reason) : item.status?.cancelledReason,
                            cancelledAt: update.status === 'cancelled' ? new Date() : item.status?.cancelledAt,
                            isRefunded: update.status === 'cancelled' ? true : item.status?.isRefunded,
                            refundedAt: update.status === 'cancelled' ? new Date() : item.status?.refundedAt,
                            updatedAt: new Date()
                        };

                        if (update.status === 'cancelled' && oldStatus !== 'cancelled') {
                            const product = await ProductModel.findById(item.product).session(session);
                            if (product) {
                                const variant = product.variants.find(
                                    v => v._id.toString() === item._id.toString()
                                );
                                if (variant) {
                                    variant.stock += item.quantity;
                                    product.totalStock += item.quantity;
                                    if (!variant.isAvailable && variant.stock > 0) {
                                        variant.isAvailable = true;
                                    }
                                    await product.save({ session });
                                }
                            }
                        }

                        if (!order.statusHistory) {
                            order.statusHistory = [];
                        }
                        
                        order.statusHistory.push({
                            status: update.status,
                            date: new Date(),
                            description: `Item "${item.title}" status changed from ${oldStatus} to ${update.status}`,
                            updatedBy: req.user.id,
                            itemId: item._id
                        });
                    }
                }

                const allItemsCancelled = order.item.every(item => 
                    item.status?.status === 'cancelled'
                );
                
                if (allItemsCancelled) {
                    order.orderStatus = 'cancelled';
                    order.hasCancelledItems = true;
                    order.cancelledBy = 'admin';
                    order.cancelledReason = reason || 'All items cancelled by admin';
                    order.cancelledAt = new Date();
                } else if (order.item.some(item => item.status?.status === 'cancelled')) {
                    order.hasCancelledItems = true;
                }
            }

            await order.save({ session });
            await session.commitTransaction();

            const updatedOrder = await OrderModel.findOne({ orderId: orderId })
                .populate('user', 'name email phone profilePicture')
                .populate('billingAddress')
                .populate('item.product', 'title thumbnail')
                .populate('item.seller', 'brandName brandCategory logo sellerName ');

            return res.status(200).json({
                success: true,
                message: "Order status updated successfully",
                data: updatedOrder
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Update order status error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderModel.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered') {
            return res.status(400).json({
                success: false,
                message: "Only cancelled or delivered orders can be deleted"
            });
        }

        await OrderModel.deleteOne({ orderId: orderId });

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.error('Delete order error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};