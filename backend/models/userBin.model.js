import mongoose from 'mongoose';

const userBinSchema = new mongoose.Schema({
   
    originalUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['customer', 'seller', 'admin'],
        default: 'customer'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'inactive'],
        default: 'active'
    },
    verified: {
        type: Boolean,
        default: false
    },
    // Deletion metadata
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deletedByEmail: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: Date.now
    },
    deletionReason: {
        type: String,
        default: 'Deleted by admin'
    }
}, {
    timestamps: true
});

// Index for better query performance
userBinSchema.index({ deletedAt: -1 });
userBinSchema.index({ originalUserId: 1 });
userBinSchema.index({ email: 1 });

const userBinModel = mongoose.model('UserBin', userBinSchema);

export default userBinModel;