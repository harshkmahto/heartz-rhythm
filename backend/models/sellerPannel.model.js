import mongoose from "mongoose";

const sellerPannelSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    coverImage: { type: String },
    logo: { type: String },
    previewImage: { type: [ String ] },
    brandyName: { type: String, required: true },
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

},    { timestamps: true })


const SellerPannel = mongoose.model('SellerPannel', sellerPannelSchema);
export default SellerPannel;