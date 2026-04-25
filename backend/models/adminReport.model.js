import mongoose from 'mongoose';

const reportStatusEnum = ['pending', 'under-review', 'resolved', 'dismissed'];
const reportTypeEnum = ['inappropriate', 'spam', 'fake', 'pricing', 'outdated', 'other'];

const reportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        unique: true,
        default: () => `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    
    productSnapshot: {
        productId: { type: String },
        title: { type: String },
        thumbnail: { type: String },
        brand: { type: String },
        category: { type: String },
        subCategory: { type: String },
        status: { type: String },
        seller: {
            sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            sellerName: { type: String },
            sellerEmail: { type: String },
            brandName: { type: String }
        }
    },
    
    issueType: {
        type: String,
        enum: reportTypeEnum,
        required: true
    },
    
    subject: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
   
    status: {
        type: String,
        enum: reportStatusEnum,
        default: 'pending'
    },
    
    adminRemarks: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    
    actionTaken: {
        type: String,
        enum: ['none', 'warning', 'product_hidden', 'product_removed', 'seller_warning', 'seller_suspended'],
        default: 'none'
    },
    
    resolvedAt: {
        type: Date
    },
    
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    sellerResponse: {
        message: { type: String, trim: true, maxlength: 1000 },
        respondedAt: { type: Date },
        respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    
    sellerAcknowledgedAt: { type: Date },
    sellerNotifiedAt: { type: Date }

}, { timestamps: true });

// Indexes only - keep these for performance
reportSchema.index({ status: 1, priority: 1, createdAt: -1 });
reportSchema.index({ product: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ 'productSnapshot.seller.sellerId': 1 });
reportSchema.index({ issueType: 1 });
reportSchema.index({ reportId: 1 });

reportSchema.virtual('age').get(function() {
    const days = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
});

const ReportModel = mongoose.model('Report', reportSchema);
export default ReportModel;