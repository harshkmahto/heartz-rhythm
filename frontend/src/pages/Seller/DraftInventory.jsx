// frontend/src/pages/seller/InventoryNotes.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Download, Edit3, Trash2, 
  AlertCircle, Package, X, ShoppingBag, TrendingUp,
  Store,
  Zap, 
} from 'lucide-react';
import { 
  getAllDraftInventory, 
  createDraftInventory, 
  updateDraftInventory, 
  deleteDraftInventory,
  bulkDeleteDraftInventory
} from '../../utils/inventory.apiReuest';
import Loader from '../../components/ShowCaseSection/Loader';
import { useSeller } from '../../context/SellerContext';
import { Link } from 'react-router-dom';

const InventoryNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const { seller }= useSeller();
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    variants: [{ color: '', stock: '', price: '' }],
    notes: ''
  });

 
  useEffect(() => {
    fetchNotes();
  }, []);

  
  useEffect(() => {
    setSelectAll(false);
    setSelectedNotes([]);
  }, [searchTerm]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getAllDraftInventory();
      if (response.success) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert(error.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', stock: '', price: '' }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const handleSave = async () => {
    try {
      // Filter out empty variants
      const filteredVariants = formData.variants.filter(v => v.color || v.stock || v.price);
      
      const dataToSave = {
        title: formData.title,
        variants: filteredVariants,
        notes: formData.notes
      };

      if (editingNote) {
        await updateDraftInventory(editingNote._id, dataToSave);
      } else {
        await createDraftInventory(dataToSave);
      }
      
      fetchNotes();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
      alert(error.message || 'Failed to save note');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDraftInventory(showDeleteConfirm);
      fetchNotes();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert(error.message || 'Failed to delete note');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotes.length === 0) {
      alert('Please select notes to delete');
      return;
    }
    if (window.confirm(`Delete ${selectedNotes.length} note(s)? This action cannot be undone.`)) {
      try {
        await bulkDeleteDraftInventory(selectedNotes);
        fetchNotes();
        setSelectedNotes([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Error bulk deleting:', error);
        alert(error.message || 'Failed to delete selected notes');
      }
    }
  };

  const handleSelectNote = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(filteredNotes.map(n => n._id));
    }
    setSelectAll(!selectAll);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      variants: [{ color: '', stock: '', price: '' }],
      notes: ''
    });
    setEditingNote(null);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      variants: note.variants?.length ? note.variants : [{ color: '', stock: '', price: '' }],
      notes: note.notes || ''
    });
    setShowModal(true);
  };

  const exportToCSV = () => {
    const headers = ['Product Name', 'Colors/Variants', 'Total Stock', 'Price', 'Notes', 'Created Date'];
    const rows = notes.map(n => [
      n.title,
      n.variants?.map(v => `${v.color} (${v.stock})`).join(', ') || '-',
      n.variants?.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0) || 0,
      n.variants?.[0]?.price ? `₹${n.variants[0].price}` : '-',
      n.notes || '-',
      new Date(n.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-notes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const filteredNotes = notes.filter(n => 
    n.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

   if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-green-100 dark:from-green-950 dark:via-black dark:to-emerald-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-emerald-200/50 dark:border-emerald-800/30">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
          
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Seller Panel Found
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't created a seller panel yet. Create one to start selling your products and manage your brand.
            </p>
            
            <div className="space-y-3">
              <Link to='/seller/create/seller-pannel'>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-3 px-4 mb-2 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                  Create Profile
                </button>
              </Link>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-white/50 dark:bg-black/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            📝 My Inventory Notes
          </h1>
          <p className="text-green-600 dark:text-green-400 mt-2">Your personal notebook - remember products you plan to sell</p>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">What is this?</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                This is your personal notebook - completely separate from your actual products. 
                Use it to jot down products you own, plan to sell, or just want to remember. 
                Add any product name, colors, stock numbers, prices - no validation needed!
              </p>
              <p className="text-xs text-green-500 dark:text-green-500 mt-2">
                💡 Tip: Think of this like Excel or Google Sheets. Nothing here affects your live store.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Notes" count={notes.length} icon={Package} color="bg-green-100 dark:bg-green-900/50 text-green-600" />
          <StatCard title="Total Items" count={notes.reduce((sum, n) => sum + (n.variants?.length || 0), 0)} icon={ShoppingBag} color="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" />
          <StatCard title="Total Stock" count={notes.reduce((sum, n) => sum + (n.variants?.reduce((s, v) => s + (parseInt(v.stock) || 0), 0) || 0), 0)} icon={TrendingUp} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600" />
          <StatCard title="With Notes" count={notes.filter(n => n.notes).length} icon={AlertCircle} color="bg-amber-100 dark:bg-amber-900/50 text-amber-600" />
        </div>

        {/* Bulk Delete Bar - Shows when items are selected */}
        {selectedNotes.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 flex items-center justify-between">
            <span className="text-sm text-red-700 dark:text-red-400">
              {selectedNotes.length} note(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all cursor-pointer text-sm"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all cursor-pointer"
            >
              <Download size={18} /> Export CSV
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all cursor-pointer"
            >
              <Plus size={18} /> Add Note
            </button>
          </div>
        </div>

        {/* Notes Table */}
        <div className="bg-white/80 dark:bg-black/40 rounded-2xl border border-green-200 dark:border-green-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-900/30">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredNotes.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">Product Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">Colors/Variants</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">Total Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-800 dark:text-green-300">Notes</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-green-800 dark:text-green-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100 dark:divide-green-800">
                {filteredNotes.map((note, idx) => (
                  <tr key={note._id} className="hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedNotes.includes(note._id)}
                        onChange={() => handleSelectNote(note._id)}
                        className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-green-700 dark:text-green-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-green-900 dark:text-green-100">{note.title || 'Untitled'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {note.variants?.slice(0, 3).map((v, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-xs text-green-700 dark:text-green-400">{v.color || '?'}</span>
                            <span className="text-xs text-green-500">({v.stock || 0})</span>
                          </div>
                        ))}
                        {note.variants?.length > 3 && (
                          <span className="text-xs text-green-500">+{note.variants.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-green-700 dark:text-green-400">
                      {note.variants?.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0) || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-700 dark:text-green-400">
                      {note.variants?.[0]?.price ? `₹${note.variants[0].price.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {note.notes && (
                        <span className="text-xs text-green-600 dark:text-green-400 line-clamp-2">
                          {note.notes}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(note)}
                          className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={16} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(note._id)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-green-300 dark:text-green-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">No Notes Yet</h3>
              <p className="text-green-600 dark:text-green-400 mb-4">Start adding products you want to remember</p>
              <button onClick={() => {
                resetForm();
                setShowModal(true);
              }} className="px-4 py-2 bg-green-600 text-white rounded-xl cursor-pointer">
                + Add Your First Note
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-black rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200 dark:border-green-800">
              <div className="sticky top-0 bg-white dark:bg-black border-b border-green-200 dark:border-green-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h2>
                <button onClick={() => {
                  setShowModal(false);
                  resetForm();
                }} className="p-2 hover:bg-green-100 rounded-lg cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="e.g., Fender Stratocaster, Gibson Les Paul..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">Colors/Variants</label>
                  {formData.variants.map((variant, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                        className="w-28 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                      />
                      {formData.variants.length > 1 && (
                        <button onClick={() => removeVariant(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addVariant} className="text-sm text-green-600 hover:text-green-700 mt-2 flex items-center gap-1 cursor-pointer">
                    <Plus size={14} /> Add another color/variant
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300 mb-1">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-black/40"
                    placeholder="Add any notes like 'Need photos', 'Check market price', 'Arriving next week'..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-black border-t border-green-200 dark:border-green-800 p-4 flex gap-3">
                <button onClick={() => {
                  setShowModal(false);
                  resetForm();
                }} className="flex-1 px-4 py-2 rounded-xl border border-green-200 text-green-700 cursor-pointer">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 cursor-pointer">
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Delete Note?</h3>
              <p className="text-green-700 dark:text-green-400 mb-6">This note will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-xl border border-green-200 text-green-700 cursor-pointer">Cancel</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryNotes;