import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Home, Building, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { getSelectedAddress } from '../../utils/order.apiRequest';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ShowCaseSection/Loader';

const AddressSection = ({ onAddressSelect }) => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth(); 

    useEffect(() => {
        if (isAuthenticated) {
            fetchSelectedAddress();
        } else {
            setLoading(false);
            setError('Please login to view address');
        }
    }, [isAuthenticated]);

    const fetchSelectedAddress = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching selected address...');
            const response = await getSelectedAddress();
            
            console.log('API Response:', response);
            
            if (response && response.success && response.data) {
                console.log('Address found:', response.data);
                setSelectedAddress(response.data);
                if (onAddressSelect) {
                    onAddressSelect(response.data);
                }
            } else {
                console.log('No address found');
                setSelectedAddress(null);
                setError('No selected address found');
                if (onAddressSelect) {
                    onAddressSelect(null);
                }
            }
        } catch (err) {
            console.error('Error fetching selected address:', err);
            setError(err?.message || 'Failed to load address');
            setSelectedAddress(null);
            if (onAddressSelect) {
                onAddressSelect(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const getAddressTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'home':
                return <Home size={18} className="text-red-500" />;
            case 'office':
                return <Briefcase size={18} className="text-red-500" />;
            default:
                return <Building size={18} className="text-red-500" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-black border border-red-500 rounded-2xl p-8 text-center">
                <Loader />
            </div>
        );
    }

    if (error || !selectedAddress) {
        return (
            <div className="bg-white dark:bg-black border-2 border-red-500 rounded-2xl p-8 text-center">
                <MapPin size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-black dark:text-white mb-3 font-medium">No selected address found</p>
                <p className="text-red-500 text-sm mb-6">Please create or select a Default address</p>
                <Link 
                    to="/my-address" 
                    className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                    <Plus size={18} />
                    Go to My Addresses
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-black border-2 border-red-500 rounded-2xl p-6">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    {getAddressTypeIcon(selectedAddress.addressType)}
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                        <p className="font-bold text-black dark:text-white text-lg">
                            {selectedAddress.name}
                        </p>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={10} />
                            Selected Address
                        </span>
                    </div>
                    
                    {/* Address line: zipcode, address, city, state all in one line */}
                    <p className="text-black dark:text-white text-sm mb-2">
                        {selectedAddress.zipCode && (
                            <span className="text-red-600 dark:text-red-400 font-medium">{selectedAddress.zipCode}</span>
                        )}
                        {selectedAddress.address && (
                            <span>, {selectedAddress.address}</span>
                        )}
                        {selectedAddress.city && (
                            <span>, {selectedAddress.city}</span>
                        )}
                        {selectedAddress.state && (
                            <span>, {selectedAddress.state}</span>
                        )}
                    </p>
                    
                    {/* Landmark line */}
                    {selectedAddress.landmark && (
                        <p className="text-red-600 dark:text-red-400 text-sm mb-2">
                            📍 {selectedAddress.landmark}
                        </p>
                    )}
                    
                    {/* Address type */}
                    <div className="flex items-center gap-2">
                        <span className="bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs px-3 py-1 rounded-full capitalize">
                            {selectedAddress.addressType === 'home' && '🏠 Home'}
                            {selectedAddress.addressType === 'office' && '💼 Office'}
                            {selectedAddress.addressType === 'other' && '📍 Other'}
                            {!selectedAddress.addressType && '📍 Address'}
                        </span>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-red-200 dark:border-red-800">
                        <Link 
                            to="/my-address"
                            className="inline-flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition-colors text-sm"
                        >
                            Change Address
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressSection;