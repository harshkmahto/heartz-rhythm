// backend/models/draftInventory.model.js
import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: { type: String, default: '', trim: true },
  stock: { type: Number, default: 0, min: 0 },
  price: { type: Number, default: 0, min: 0 }
});

const draftInventorySchema = new mongoose.Schema({
  sellerPanel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerPannel',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  variants: [variantSchema],
  notes: {
    type: String,
    default: '',
    trim: true
  }
}, { 
  timestamps: true 
});


draftInventorySchema.index({ title: 'text' });

const DraftInventory = mongoose.model('DraftInventory', draftInventorySchema);
export default DraftInventory;