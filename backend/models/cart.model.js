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
        max: 3,
    },
    mrp: {  
        type: Number,
        required: true,
    },
    finalPrice: {  
        type: Number,
        required: true,
    },
    thumbnail: String,
    title: String,
    brand: String,
    category: String,
    subCategory: String,
    colorName: String,
    colorCode: String,
    stock: Number,
}, { timestamps: true });

cartItemSchema.index({ user: 1, product: 1, variantId: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartItemSchema);
export default Cart;