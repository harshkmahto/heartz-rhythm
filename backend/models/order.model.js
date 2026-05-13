import mongoose from "mongoose";

const itemStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'replaced'],
        default: 'pending'
    },
    cancelledBy: {
        type: String,
        enum: ['customer', 'seller', 'admin'],
    },
    cancelledReason: {
        type: String,
        trim: true,
    },
    cancelledAt: Date,
    isRefunded: {
        type: Boolean,
        default: false,
    },
    refundedAt: Date,
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const itemsSchema = new mongoose.Schema({
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SellerPannel',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        
    },
    colorName: {
        type: String,
        required: true
    },
    colorCode: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        
    },
    mrp: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    status:itemStatusSchema

});

const razorpayDetailsSchema = new mongoose.Schema({
    orderId: {
        type: String, 
        trim: true
    },
    paymentId: {
        type: String, 
        trim: true
    },
    signature: {
        type: String,
        trim: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
      orderId: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    billingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    
    },
    item: [itemsSchema],
    itemCount:{
        type:Number,
        required:true
    },
    subTotal: {
        type: Number,
        required: true
    },
    shippingCharge: {
        type: Number,
        default: 49,
        required: true
    },
    platformFee: {
        type: Number,
        default: 12,
        required: true
    },

    discount: {
        type: Boolean,
    },
    discountValue: {
        type: Number,
    },
    discountCode: {
        type: String,
    },
    totalPrice: {
        type: Number,
        required: true,
         comment: "Final payable amount (subtotal + shippingCharge + platformFee - discountValue)"
    },

    paymentType: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed', 'review', 'refunded'],
        default: 'pending',
        required: true
    },
    orderStatus: {
        type: String,
        enum: [ 'placed', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'replaced'],
        default: 'placed',
        required: true
        
    },
    razorpayDetails: {
        type: razorpayDetailsSchema,
        default: null
    },
    cancelledBy: {
        type: String,
        enum: ['customer', 'seller', 'admin'],

    },
    cancelledReason: {
        type: String,
        trim: true,
    },
    cancelledAt: Date,

    isRefunded: {
        type: Boolean,
        default: false,
    },
    refundedAt: {
        type: Date,
    },
    
    hasCancelledItems: {
        type: Boolean,
        default: false,
    },



}, { timestamps: true })

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;