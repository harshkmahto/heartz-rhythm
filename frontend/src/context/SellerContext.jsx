// contexts/SellerContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getMySellerPannel, getMe } from '../utils/apiRequest';

const SellerContext = createContext();

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userResponse = await getMe();
      const userRole = userResponse.user?.role;
      
      
      if (userRole === 'seller') {
        const response = await getMySellerPannel();
        setSeller(response.data);
      } else {
        setSeller(null);
      }
    } catch (err) {
   
      
      if (err.status !== 401 && err.status !== 403) {
       
        setError(err.message || 'Failed to fetch seller data');
      }
      setSeller(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const value = {
    seller,
    loading,
    error,
    isSellerExists: !!seller
  };

  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
};