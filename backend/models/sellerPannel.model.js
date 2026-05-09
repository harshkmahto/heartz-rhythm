import mongoose from "mongoose";

const sellerPannelSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },

    coverImage: { type: String },
    coverImageId: { type: String },
    logo: { type: String },
    logoId: { type: String },
    previewImage: { type: [ String ] },
    previewImageIds: { type: [String] },
    brandName: { type: String, required: true },
    brandDescription: { type: String },
    brandCategory: { type: String },
    brandSubCategory: { type: String },
    brandPhone: { type: Number },
    brandEmail: { type: String },
    brandSpeciality: { type: String },
    brandFeatures: { type: [String] },
    brandSince: { type: Date },


    sellerName: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    sellerPhone: { type: Number, required: true },
    
    gstNumber: { type: String },
    panNumber: { type: String },

    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankBranch: { type: String },
    bankUserName: { type: String },
    upi: { type: String },


    companyLocation: { type: String },
    companyAddress: { type: String },


    pickupLocation: { type: String },
    pickupAddress: { type: String },

    status: {
        type: String,
        enum: [ 'active', 'inactive', 'pending'],
        default: 'inactive',
        required: true
    },

    store:{
        type: String,
        enum: [ 'open', 'close'],
        default: 'open',
        required: true
    },

    reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                rating: { type: Number, required: true, min: 0, max: 5 },
                comment: { type: String, trim: true, },
                createdAt: { type: Date, default: Date.now }
            }
        ],

},    { timestamps: true })

sellerPannelSchema.index({ user: 1 }, { unique: true });

const SellerPannel = mongoose.model('SellerPannel', sellerPannelSchema);
export default SellerPannel;