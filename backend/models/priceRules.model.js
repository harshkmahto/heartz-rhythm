// models/priceRule.model.js
import mongoose from 'mongoose';

const priceRuleSchema = new mongoose.Schema({
    ruleName: { type: String, required: true },
    
    
    applyTo: {
        type: String,
        enum: ['all', 'category', 'brand', 'product'],
        required: true
    },
    targetId: { type: String }, 
    targetIds: [{ type: String }], 
    
    
    adjustmentType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    operator: {
        type: String,
        enum: ['increase', 'decrease'],
        required: true
    },
    value: { type: Number, required: true }, 
    

    filters: {
        hasReplacement: { type: Boolean },
        hasReturn: { type: Boolean },
        minStock: { type: Number },
        maxStock: { type: Number }
    },
    
    // Schedule
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    
    
    priority: { type: Number, default: 0 },
    
  
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    
}, { timestamps: true });


priceRuleSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
priceRuleSchema.index({ priority: -1 });

const PriceRule = mongoose.model('PriceRule', priceRuleSchema);
export default PriceRule;