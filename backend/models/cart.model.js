// models/cart.model.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    finalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
    },
    colorName: {
        type: String,
        required: true,
    },
    colorCode: {
        type: String, 
    },
    stock: {
        type: Number, 
        required: true,
    }
}, { timestamps: true });

cartItemSchema.index({ user: 1, product: 1, variantId: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartItemSchema);
export default Cart;