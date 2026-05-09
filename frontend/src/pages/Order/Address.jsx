import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Plus, ChevronDown, ChevronUp, Edit2, Trash2, 
  CheckCircle, X, Mail, Phone, Map, Building, Navigation, 
  Star, AlertCircle, Loader2
} from 'lucide-react';
import { 
  getMyAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setSelectedAddress 
} from '../../utils/order.apiRequest';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [deletePopup, setDeletePopup] = useState({ show: false, addressId: null });
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    city: '',
    state: '',
    country: 'India',
    addressType: 'home',
    zipCode: '',
    address: '',
    landmark: '',
    isSelected: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getMyAddresses();
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      alert(error.message || 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      city: '',
      state: '',
      country: 'India',
      addressType: 'home',
      zipCode: '',
      address: '',
      landmark: '',
      isSelected: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingAddress) {
        const response = await updateAddress(editingAddress._id, formData);
        if (response.success) {
          await fetchAddresses();
          resetForm();
        }
      } else {
        const response = await createAddress(formData);
        if (response.success) {
          await fetchAddresses();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert(error.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || '',
      email: address.email || '',
      phone: address.phone || '',
      alternatePhone: address.alternatePhone || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'India',
      addressType: address.addressType || 'home',
      zipCode: address.zipCode || '',
      address: address.address || '',
      landmark: address.landmark || '',
      isSelected: address.isSelected || false
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deletePopup.addressId) return;
    
    setSubmitting(true);
    try {
      const response = await deleteAddress(deletePopup.addressId);
      if (response.success) {
        await fetchAddresses();
        setDeletePopup({ show: false, addressId: null });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert(error.message || 'Failed to delete address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAddress = async (addressId) => {
    try {
      const response = await setSelectedAddress(addressId);
      if (response.success) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error selecting address:', error);
      alert(error.message || 'Failed to select address');
    }
  };

  const toggleExpand = (addressId) => {
    setExpandedAddress(expandedAddress === addressId ? null : addressId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Addresses</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Addresses Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first address to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 ${
                  address.isSelected 
                    ? 'border-red-500 shadow-lg ring-2 ring-red-500/20' 
                    : 'border-gray-200 dark:border-gray-800 hover:shadow-md'
                }`}
              >
                {/* Address Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {address.name}
                        </h3>
                        {address.isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs rounded-full">
                            <Star size={12} />
                            Default
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full capitalize">
                          {address.addressType}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{address.address}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {address.city}, {address.state} - {address.zipCode}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!address.isSelected && (
                        <button
                          onClick={() => handleSelectAddress(address._id)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all cursor-pointer"
                          title="Set as default"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeletePopup({ show: true, addressId: address._id })}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => toggleExpand(address._id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
                      >
                        {expandedAddress === address._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedAddress === address._id && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Mail size={16} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Email</p>
                          <p className="text-sm text-gray-900 dark:text-white">{address.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone size={16} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900 dark:text-white">{address.phone}</p>
                          {address.alternatePhone && (
                            <p className="text-sm text-gray-500">{address.alternatePhone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Map size={16} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Full Address</p>
                          <p className="text-sm text-gray-900 dark:text-white">{address.address}</p>
                          {address.landmark && (
                            <p className="text-sm text-gray-500">Landmark: {address.landmark}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation size={16} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Location</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {address.city}, {address.state}, {address.country}
                          </p>
                          <p className="text-sm text-gray-500">PIN: {address.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="House number, street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nearby landmark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="6-digit PIN code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isSelected"
                    checked={formData.isSelected}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Set as default address
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    editingAddress ? 'Update Address' : 'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Address</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletePopup({ show: false, addressId: null })}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;