import React, { useState, useEffect } from 'react';
import { useSeller } from '../../../context/SellerContext';
import { storeOpenClose } from '../../../utils/apiRequest';
import { Loader2 } from 'lucide-react';

const SellingOnOff = () => {
  const { seller, refreshSeller } = useSeller();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seller) {
      setEnabled(seller.store === 'open');
    }
  }, [seller]);

  const handleToggle = async () => {
    if (!seller) return;
    
    const newStatus = enabled ? 'close' : 'open';
    setLoading(true);
    
    try {
      const response = await storeOpenClose(newStatus);
      if (response.success) {
        setEnabled(newStatus === 'open');
        if (refreshSeller) {
          await refreshSeller();
        }
      }
    } catch (error) {
      console.error('Store toggle error:', error);
      alert(error.message || 'Failed to update store status');
    } finally {
      setLoading(false);
    }
  };

  if (!seller) {
    return (
      <div className="bg-black/10 dark:bg-white/10 p-3 rounded-2xl text-center">
        <p className="text-sm text-gray-500">Store status unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-black/10 dark:bg-white/10 p-3 rounded-2xl text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {enabled ? 'Store Open' : 'Store Closed'}
        </span>
        
        <button
          onClick={handleToggle}
          disabled={loading || seller.status !== 'active'}
          className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 
            ${enabled ? "bg-emerald-500" : "bg-gray-400"}
            ${(loading || seller.status !== 'active') ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin mx-auto" />
          ) : (
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 
                ${enabled ? "translate-x-8" : "translate-x-0"}`}
            />
          )}
        </button>
        
        {seller.status !== 'active' && (
          <p className="text-xs text-red-500 mt-1">
            Store must be active to toggle
          </p>
        )}
      </div>
    </div>
  );
};

export default SellingOnOff;