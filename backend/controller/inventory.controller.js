import DraftInventory from '../models/draftInventory.model.js';
import SellerPannel from '../models/sellerPannel.model.js';
import InventoryNote from '../models/inventory.model.js';


//---------------DRAFT INVENTORY--------------------

// GET ALL DRAFT NOTES
export const getAllDraftInventory = async (req, res) => {
  try {
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    
    if (!sellerPanel) {
      return res.status(400).json({
        success: false,
        message: "Seller profile not found. Please complete your seller registration first."
      });
    }

    const notes = await DraftInventory.find({ sellerPanel: sellerPanel._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching draft notes:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE DRAFT NOTE
export const createDraftInventory = async (req, res) => {
  try {
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    
    if (!sellerPanel) {
      return res.status(400).json({
        success: false,
        message: "Seller profile not found. Please complete your seller registration first."
      });
    }

    const { title, variants, notes } = req.body;

    const newNote = await DraftInventory.create({
      sellerPanel: sellerPanel._id,
      title: title || '',
      variants: variants || [],
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: "Draft note created successfully",
      data: newNote
    });
  } catch (error) {
    console.error('Error creating draft note:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE DRAFT NOTE
export const updateDrafInventory = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, variants, notes } = req.body;

    const note = await DraftInventory.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Draft note not found"
      });
    }

    // Verify ownership
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel || note.sellerPanel.toString() !== sellerPanel._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this note"
      });
    }

    const updatedNote = await DraftInventory.findByIdAndUpdate(
      noteId,
      {
        title: title || '',
        variants: variants || [],
        notes: notes || ''
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Draft note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    console.error('Error updating draft note:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE DRAFT NOTE
export const deleteDrafInventory = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await DraftInventory.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Draft note not found"
      });
    }

    // Verify ownership
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel || note.sellerPanel.toString() !== sellerPanel._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this note"
      });
    }

    await DraftInventory.findByIdAndDelete(noteId);

    return res.status(200).json({
      success: true,
      message: "Draft note deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting draft note:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE DRAFT NOTE
export const getSingleDrafInventory = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await DraftInventory.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Draft note not found"
      });
    }

    // Verify ownership
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel || note.sellerPanel.toString() !== sellerPanel._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this note"
      });
    }

    return res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Error fetching draft note:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// BULK DELETE DRAFT NOTES
export const bulkDeleteDraftInventory = async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of note IDs to delete"
      });
    }

    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    
    if (!sellerPanel) {
      return res.status(400).json({
        success: false,
        message: "Seller profile not found"
      });
    }

    const result = await DraftInventory.deleteMany({
      _id: { $in: noteIds },
      sellerPanel: sellerPanel._id
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} draft note(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting draft notes:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};







//--------------------INVENTORY-----------------------

// GET ALL INVENTORY NOTES
export const getAllInventory = async (req, res) => {
  try {
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel) {
      return res.status(400).json({ success: false, message: "Seller profile not found" });
    }

    const notes = await InventoryNote.find({ sellerPanel: sellerPanel._id })
      .populate('productId', 'title thumbnail variants totalStock status category')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE INVENTORY NOTE (Separate)
export const createInventoryNote = async (req, res) => {
  try {
    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel) {
      return res.status(400).json({ 
        success: false, 
        message: "Seller profile not found" 
      });
    }

    const { productId, notes } = req.body;

    // Check if note already exists for this product
    const existingNote = await InventoryNote.findOne({ 
      sellerPanel: sellerPanel._id, 
      productId 
    });

    if (existingNote) {
      return res.status(400).json({ 
        success: false, 
        message: "Note already exists for this product. Use update endpoint instead." 
      });
    }

    const newNote = await InventoryNote.create({
      sellerPanel: sellerPanel._id,
      productId,
      notes: notes || ''
    });

    return res.status(201).json({ 
      success: true, 
      message: "Inventory note created successfully",
      data: newNote 
    });
  } catch (error) {
    console.error('Error creating inventory note:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// UPDATE INVENTORY NOTE (Separate)
export const updateInventoryNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { notes } = req.body;

    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel) {
      return res.status(400).json({ 
        success: false, 
        message: "Seller profile not found" 
      });
    }

    const note = await InventoryNote.findById(noteId);
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: "Inventory note not found" 
      });
    }

    // Verify ownership
    if (note.sellerPanel.toString() !== sellerPanel._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to update this note" 
      });
    }

    note.notes = notes || '';
    await note.save();

    return res.status(200).json({ 
      success: true, 
      message: "Inventory note updated successfully",
      data: note 
    });
  } catch (error) {
    console.error('Error updating inventory note:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// DELETE INVENTORY NOTE
export const deleteInventoryNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel) {
      return res.status(400).json({ 
        success: false, 
        message: "Seller profile not found" 
      });
    }

    const note = await InventoryNote.findById(noteId);
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: "Inventory note not found" 
      });
    }

    // Verify ownership
    if (note.sellerPanel.toString() !== sellerPanel._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to delete this note" 
      });
    }

    await InventoryNote.findByIdAndDelete(noteId);

    return res.status(200).json({ 
      success: true, 
      message: "Inventory note deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting inventory note:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// GET SINGLE INVENTORY NOTE BY PRODUCT ID
export const getInventoryNoteByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const sellerPanel = await SellerPannel.findOne({ user: req.user.id });
    if (!sellerPanel) {
      return res.status(400).json({ 
        success: false, 
        message: "Seller profile not found" 
      });
    }

    const note = await InventoryNote.findOne({ 
      sellerPanel: sellerPanel._id, 
      productId 
    }).populate('productId', 'title thumbnail variants totalStock status');

    return res.status(200).json({ 
      success: true, 
      data: note 
    });
  } catch (error) {
    console.error('Error fetching inventory note:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};