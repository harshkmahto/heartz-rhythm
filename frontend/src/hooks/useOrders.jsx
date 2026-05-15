import { useState, useEffect, useCallback } from 'react';
import { getAllOrders, deleteOrder } from '../utils/order.apiRequest';
import { formatDate, formatPrice } from '../Helper/Format';

const useOrders = (filterStatus = null, filterPaymentStatus = null) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    delivered: 0,
    cancelled: 0,
    pending: 0,
    refund: 0,
    revenue: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders();
      
      if (response.success) {
        let allOrders = response.data.orders;
        
        if (filterStatus) {
          allOrders = allOrders.filter(order => order.orderStatus === filterStatus);
        }
        
        if (filterPaymentStatus) {
          allOrders = allOrders.filter(order => order.paymentStatus === filterPaymentStatus);
        }
        
        setOrders(allOrders);
        setTotalOrders(allOrders.length);
        
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        setStats({
          total: allOrders.length,
          placed: allOrders.filter(o => o.orderStatus === 'placed').length,
          delivered: allOrders.filter(o => o.orderStatus === 'delivered').length,
          cancelled: allOrders.filter(o => o.orderStatus === 'cancelled').length,
          pending: allOrders.filter(o => o.orderStatus === 'pending').length,
          refund: allOrders.filter(o => o.paymentStatus === 'refunded').length,
          revenue: totalRevenue
        });
        
        applyFilters(allOrders);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterStatus, filterPaymentStatus]);

  const applyFilters = useCallback((ordersList = orders) => {
    let filtered = [...ordersList];
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentType === paymentFilter);
    }
    
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(search) ||
        order.user?.name?.toLowerCase().includes(search) ||
        order.user?.email?.toLowerCase().includes(search) ||
        order.items?.some(item => item.title.toLowerCase().includes(search))
      );
    }
    
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(order => new Date(order.createdAt) >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(order => new Date(order.createdAt) <= endDate);
    }
    
    const startIndex = (currentPage - 1) * 10;
    const paginatedFiltered = filtered.slice(startIndex, startIndex + 10);
    setFilteredOrders(paginatedFiltered);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [orders, paymentFilter, searchTerm, dateRange, currentPage]);

  const handleDeleteOrder = async (orderId) => {
    try {
      setDeleting(true);
      const response = await deleteOrder(orderId);
      if (response.success) {
        await fetchOrders();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      applyFilters();
    }
  }, [searchTerm, paymentFilter, dateRange, currentPage, applyFilters, orders.length]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPaymentFilter('all');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };


  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      replaced: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return {
    orders,
    filteredOrders,
    loading,
    error,
    refreshing,
    deleting,
    searchTerm,
    setSearchTerm,
    paymentFilter,
    setPaymentFilter,
    dateRange,
    setDateRange,
    currentPage,
    setCurrentPage,
    totalPages,
    totalOrders,
    stats,
    copiedId,
    copyOrderId,
    handleRefresh,
    resetFilters,
    fetchOrders,
    handleDeleteOrder,
    formatDate,
    formatPrice,
    getStatusColor,
    getPaymentStatusColor
  };
};

export default useOrders;