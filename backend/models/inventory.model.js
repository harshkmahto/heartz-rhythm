import mongoose from 'mongoose';

const inventoryNoteSchema = new mongoose.Schema({
  sellerPanel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerPannel',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true });

// Ensure one note per product per seller
inventoryNoteSchema.index({ sellerPanel: 1, productId: 1 }, { unique: true });

const InventoryNote = mongoose.model('InventoryNote', inventoryNoteSchema);
export default InventoryNote;