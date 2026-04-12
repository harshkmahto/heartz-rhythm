// models/otp.model.js
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['seller_register', 'forget_password'],  // Add this!
        default: 'seller_register'
    },
    attempts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Auto delete after 10 minutes
    }
});

const otpModel = mongoose.model('OTP', otpSchema);

export default otpModel;