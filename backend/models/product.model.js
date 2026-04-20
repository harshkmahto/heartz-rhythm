import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim:true, lowercase:true },
    colorCode: { type: String, required: true,
                 match: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/ },
    basePrice: { type: Number, required: true, default: 0, min: 0 },
    mrp: { type: Number, required: true, default: 0, min: 0,
            validate: {
                validator: function(v) {
                    return v>= this.basePrice; 
                },
                message:`MRP should be greater than or equal to basePrice `
            },
    },
    finalPrice: { type: Number, min: 0 },      
    stock: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },       

});

const productSchema = new mongoose.Schema({

      seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
      sellerPanel: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SellerPannel', 
        required: true,
        index: true 
    },

    title: { type: String, required: true, trim: true, index:true },
    subtitle: { type: String, trim: true },
    description: { type: String,  },
    features: { type: [String], trim: true, index:true },
    category: { type: String, required: true, index:true, trim: true },
    subCategory: { type: String, index:true, trim: true },
    brand: { type: String, required: true, index:true, trim: true },
    about:[
        {
        key: { type: String, trim: true, },
        value: { type: String, trim: true, },
        }
    ],

    showCase:[{
        image: { type: String },
        key: { type: String, trim: true, },
        value: { type: String, trim: true, },
    }],


    thumbnail: { type: String, required: true },
    images: { type: [String] },
    gallery: { type: [String] },
    preview: { type: String },
    videos: { type: [String] },

    variants: [colorSchema],

    //inventry
    totalStock: { type: Number, default: 0, min: 0 },

    discount: {
        type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
        value: { type: Number, min: 0 },
        code: { type: String, trim: true, uppercase:true },

     },
   




    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, required: true, min: 0, max: 5 },
            comment: { type: String, trim: true, },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    replacement: {
        isAvailable: { type: Boolean, required:true },
        duration: { type: Number }, // in days
        policy: { type: String, trim:true }
    },

    return:{
        isAvailable: { type: Boolean, required:true } ,
        duration: { type: Number }, // in days
        policy: { type: String, trim:true }
    },

    replaceCount: { type: Number, default: 0, min: 0 },
    returnCount: { type: Number, default: 0, min: 0 },

    status: {
         type: String,
         enum: ['active', 'draft', 'scheduled'],
         default: 'draft',
         index:true
         },
    
    isFeatured: { type: Boolean, default: false, index:true },

    isComingSoon: { type: Boolean, default: false,
        required: function() { return this.status === 'scheduled' || this.status === 'draft' ; }
     },

     mostOrderProduct: { type: Boolean, default: false},
     bestSeller: { type: Boolean, default: false},
     mostLovedProduct: { type: Boolean, default: false},
     mostViewedProduct: { type: Boolean, default: false},
     mostSerchedProduct: { type: Boolean, default: false},

     

    totalSold: { type: Number, default: 0, min: 0, index:true },
    viewCount: { type: Number, default: 0, min: 0 },
    searchCount: { type: Number, default: 0, min: 0 },


    seo:{
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: { type: [String], trim: true },
    }

}, { timestamps: true });

productSchema.index({ title: 'text', category: 'text', features: 'text', brand: 'text' });
productSchema.index({ category: 1, subCategory: 1, brand: 1 });
productSchema.index({ status: 1, isFeatured: 1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ 'variants.colorCode': 1 });



const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;