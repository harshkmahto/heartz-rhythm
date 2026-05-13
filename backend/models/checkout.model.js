import mongoose from "mongoose";

const checkoutItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 3
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
    }
});

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        default: null
    },
    items: [checkoutItemSchema],
    subtotal: {
        type: Number,
        default: 0
    },
    shippingCharge: {
        type: Number,
        default: 49
    },
    platformFee: {
        type: Number,
        default: 12
    },
    discount: {
        type: Boolean,
        default: false
    },
    discountValue: {
        type: Number,
        default: 0
    },
    discountCode: {
        type: String,
        trim: true,
        uppercase: true,
        default: null
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 60 * 1000)
    }
}, { 
    timestamps: true 
});


checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Checkout = mongoose.model('Checkout', checkoutSchema);
export default Checkout;