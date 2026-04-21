// frontend/src/pages/seller/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Package, ShoppingBag, TrendingUp, AlertCircle,
  Trash2, X, Check, Eye, FileText, Plus, Edit3
} from 'lucide-react';
import { getMyProducts } from '../../utils/product.apiRequest';
import { 
  getAllInventory, 
  createInventory, 
  updateInventory, 
  deleteInventory,
} from '../../utils/inventory.apiReuest';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('draft');
  const [products, setProducts] = useState([]);
  const [inventoryNotes, setInventoryNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, notesRes] = await Promise.all([
        getMyProducts(),
        getAllInventory()
      ]);
      
      if (productsRes.success) {
        setProducts(productsRes.data.products);
      }
      if (notesRes && notesRes.success) {
        setInventoryNotes(notesRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setInventoryNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Get draft products (status = 'draft')
  const draftProducts = products.filter(p => p.status === 'draft');
  
  // Get low stock products (any variant stock < 10 and > 0)
  const lowStockProducts = products.filter(p => 
    p.variants?.some(v => v.stock > 0 && v.stock < 10)
  );

  // Get products that have inventory notes
  const notedProducts = inventoryNotes.map(note => ({
    ...note.productId,
    noteId: note._id,
    noteText: note.notes
  })).filter(p => p);

  const getDisplayProducts = () => {
    switch(activeTab) {
      case 'draft': return draftProducts;
      case 'lowstock': return lowStockProducts;
      case 'notes': return notedProducts;
      default: return draftProducts;
    }
  };

  const getProductNote = (productId) => {
    const note = inventoryNotes.find(n => n.productId?._id === productId);
    return note?.notes || '';
  };

  const getProductNoteId = (productId) => {
    const note = inventoryNotes.find(n => n.productId?._id === productId);
    return note?._id || null;
  };

  const openNoteModal = (product) => {
    setSelectedProduct(product);
    const existingNote = inventoryNotes.find(n => n.productId?._id === product._id);
    if (existingNote) {
      setNoteText(existingNote.notes);
      setEditingNoteId(existingNote._id);
    } else {
      setNoteText('');
      setEditingNoteId(null);
    }
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!selectedProduct) return;
    
    try {
      if (editingNoteId) {
        await updateInventory(editingNoteId, { notes: noteText });
      } else {
        await createInventory({
          productId: selectedProduct._id,
          notes: noteText
        });
      }
      await fetchData();
      setShowNoteModal(false);
      setSelectedProduct(null);
      setNoteText('');
      setEditingNoteId(null);
    } catch (error) {
      console.error('Error saving note:', error);
      alert(error.message || 'Failed to save note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note? This action cannot be undone.')) {
      try {
        await deleteInventory(noteId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert(error.message || 'Failed to delete note');
      }
    }
  };

  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 dark:text-green-400">{title}</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{count}</p>
        </div>
        <div className={`${color} p-2 rounded-xl`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  const filteredProducts = getDisplayProducts().filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            📦 My Inventory
          </h1>
          <p className="text-green-600 dark:text-green-400 mt-2">Track your draft products, low stock items, and personal notes</p>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Welcome to Your Inventory</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                This is your central hub for managing products. 
                <strong> Draft Products</strong> are saved but not visible to customers. 
                <strong> Low Stock</strong> shows items with less than 10 units. 
                <strong> My Notes</strong> are your personal reminders attached to any product.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Draft Products" count={draftProducts.length} icon={Package} color="bg-green-100 dark:bg-green-900/50 text-green-600" />
          <StatCard title="Low Stock Items" count={lowStockProducts.length} icon={AlertCircle} color="bg-amber-100 dark:bg-amber-900/50 text-amber-600" />
          <StatCard title="My Notes" count={inventoryNotes.length} icon={FileText} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-green-200 dark:border-green-800 pb-2">
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-5 py-2.5 rounded-t-lg font-medium transition-all cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
            }`}
          >
            📝 Draft Products ({draftProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('lowstock')}
            className={`px-5 py-2.5 rounded-t-lg font-medium transition-all cursor-pointer ${
              activeTab === 'lowstock'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
            }`}
          >
            ⚠️ Low Stock ({lowStockProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-5 py-2.5 rounded-t-lg font-medium transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
            }`}
          >
            📋 My Notes ({inventoryNotes.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'draft' ? 'draft' : activeTab === 'lowstock' ? 'low stock' : 'noted'} products...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const firstVariant = product.variants?.[0];
            const existingNote = inventoryNotes.find(n => n.productId?._id === product._id);
            const hasNote = !!existingNote;
            const noteId = existingNote?._id;
            
            return (
              <div key={product._id} className="group bg-white/80 dark:bg-black/40 rounded-2xl overflow-hidden border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden bg-green-100 dark:bg-green-900/30">
                  {product.thumbnail ? (
                    <Link to={`/seller/product/details/${product._id}`}>
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-green-400" />
                    </div>
                  )}
                  
                  {/* Stock Badge for Low Stock Tab */}
                  {activeTab === 'lowstock' && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/seller/product/details/${product._id}`}>
                    <h3 className="font-bold text-green-900 dark:text-green-100 text-lg mb-1 line-clamp-1 hover:text-green-600 transition-colors cursor-pointer">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">
                      {product.brand}
                    </span>
                  </div>

                  {/* Colors/Variants with Stock */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.variants.slice(0, 4).map((variant, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <div 
                            className="w-5 h-5 rounded-full border border-green-300 shadow-sm"
                            style={{ backgroundColor: variant.colorCode }}
                            title={variant.name}
                          />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {variant.stock}
                          </span>
                        </div>
                      ))}
                      {product.variants.length > 4 && (
                        <span className="text-xs text-green-500">+{product.variants.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  {firstVariant && (
                    <div className="mb-3">
                      <span className="text-lg font-bold text-green-700 dark:text-green-300">
                        ₹{firstVariant.basePrice?.toLocaleString()}
                      </span>
                      <span className="ml-2 text-sm text-green-500 line-through">
                        ₹{firstVariant.mrp?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Stock Status */}
                  {product.variants?.some(v => v.stock > 0 && v.stock < 10) && (
                    <div className="mb-3">
                      <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Low stock alert
                      </span>
                    </div>
                  )}

                  {/* Note Display - Show if note exists */}
                  {hasNote && (
                    <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-green-700 dark:text-green-400 line-clamp-2">
                        📝 {existingNote.notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-green-200 dark:border-green-800">
                    <Link to={`/seller/product/details/${product._id}`} className="flex-1">
                      <button className="w-full px-3 py-1.5 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 text-sm cursor-pointer transition-all">
                        <Eye size={14} className="inline mr-1" /> View
                      </button>
                    </Link>
                    <button
                      onClick={() => openNoteModal(product)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      {hasNote ? (
                        <><Edit3 size={14} /> Edit Note</>
                      ) : (
                        <><Plus size={14} /> Add Note</>
                      )}
                    </button>
                    {activeTab === 'notes' && noteId && (
                      <button
                        onClick={() => handleDeleteNote(noteId)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm cursor-pointer transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white/80 dark:bg-black/40 rounded-2xl border border-green-200 dark:border-green-800">
            <Package className="w-16 h-16 text-green-300 dark:text-green-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
              No {activeTab === 'draft' ? 'Draft Products' : activeTab === 'lowstock' ? 'Low Stock Items' : 'Notes'} Found
            </h3>
            <p className="text-green-600 dark:text-green-400">
              {activeTab === 'draft' 
                ? 'Create draft products to see them here' 
                : activeTab === 'lowstock' 
                ? 'Products with stock below 10 units will appear here'
                : 'Click "Add Note" on any product to add a personal reminder'}
            </p>
          </div>
        )}

        {/* Add/Edit Note Modal */}
        {showNoteModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full border border-green-200 dark:border-green-800">
              <div className="p-4 border-b border-green-200 dark:border-green-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
                  {editingNoteId ? 'Edit Note' : 'Add Note'}
                </h2>
                <button 
                  onClick={() => {
                    setShowNoteModal(false);
                    setSelectedProduct(null);
                    setNoteText('');
                    setEditingNoteId(null);
                  }} 
                  className="p-1 hover:bg-green-100 rounded-lg cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                  Product: <span className="font-semibold text-green-800 dark:text-green-200">{selectedProduct.title}</span>
                </p>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500"
                  placeholder="Add your notes here... (e.g., Need photos, Check price, Arriving next week)"
                  autoFocus
                />
              </div>

              <div className="p-4 border-t border-green-200 dark:border-green-800 flex gap-3">
                <button 
                  onClick={() => {
                    setShowNoteModal(false);
                    setSelectedProduct(null);
                    setNoteText('');
                    setEditingNoteId(null);
                  }} 
                  className="flex-1 px-4 py-2 rounded-xl border border-green-200 text-green-700 hover:bg-green-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNote} 
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;