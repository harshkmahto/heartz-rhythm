import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Flag, 
  Package, 
  Star, 
  Calendar, 
  Mail,
  Search,
  Filter,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getMyReportedProducts, sellerRespondToReport, } from '../../utils/product.apiRequest';

const ReportedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    issueType: '',
    fromDate: '',
    toDate: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewingReports, setViewingReports] = useState(null);
  const [showReportsModal, setShowReportsModal] = useState(false);

  // Fetch reported products
  const fetchReportedProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters
      };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const response = await getMyReportedProducts(params);
      if (response.success) {
        setProducts(response.data.products);
        setSummary(response.data.summary);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalProducts: response.data.pagination.totalProducts
        }));
      }
    } catch (error) {
      console.error('Error fetching reported products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedProducts();
  }, [pagination.currentPage, filters]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      issueType: '',
      fromDate: '',
      toDate: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle respond to report
  const handleRespond = async () => {
    if (!selectedReport || !responseText.trim()) return;
    setSubmitting(true);
    try {
      const response = await sellerRespondToReport(selectedReport._id, responseText);
      if (response.success) {
        await fetchReportedProducts();
        setShowResponseModal(false);
        setSelectedReport(null);
        setResponseText('');
      }
    } catch (error) {
      console.error('Error responding to report:', error);
      alert(error.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  // View all reports for a product
  const viewProductReports = async (product) => {
    setViewingReports(product);
    setShowReportsModal(true);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'under-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    };
    return styles[status] || styles.pending;
  };

  // Get issue type icon
  const getIssueIcon = (type) => {
    const icons = {
      inappropriate: <AlertTriangle size={14} />,
      spam: <Flag size={14} />,
      fake: <Package size={14} />,
      pricing: <Star size={14} />,
      outdated: <Calendar size={14} />,
      other: <Mail size={14} />
    };
    return icons[type] || <AlertCircle size={14} />;
  };

  // Stats cards with green theme
  const statCards = [
    { 
      label: 'Products with Reports', 
      value: summary?.totalProductsWithReports || 0, 
      icon: <Package size={20} />, 
      color: 'green' 
    },
    { 
      label: 'Total Reports', 
      value: summary?.totalReports || 0, 
      icon: <Flag size={20} />, 
      color: 'emerald' 
    },
    { 
      label: 'Pending', 
      value: summary?.pendingReports || 0, 
      icon: <Clock size={20} />, 
      color: 'yellow' 
    },
    { 
      label: 'Resolved', 
      value: summary?.resolvedReports || 0, 
      icon: <CheckCircle size={20} />, 
      color: 'green' 
    },
    { 
      label: 'Dismissed', 
      value: summary?.dismissedReports || 0, 
      icon: <XCircle size={20} />, 
      color: 'gray' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="text-green-500" size={32} />
            Reported Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and respond to reports about your products
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-black rounded-xl p-4 border border-${card.color}-100 dark:border-${card.color}-900/30 shadow-sm`}
            >
              <div className={`flex items-center justify-between mb-2 text-${card.color}-500`}>
                {card.icon}
                <span className={`text-xs font-medium text-${card.color}-600 dark:text-${card.color}-400`}>
                  {card.label}
                </span>
              </div>
              <p className={`text-2xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filter Panel */}
        <div className="bg-white dark:bg-black rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm mb-6">
          <div className="p-4 border-b border-green-100 dark:border-green-900/30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
              >
                <Filter size={18} />
                Filters
                {(filters.status || filters.issueType || filters.fromDate || filters.toDate) && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
              >
                <X size={18} />
                Clear
              </button>
              <button
                onClick={fetchReportedProducts}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Type</label>
                <select
                  name="issueType"
                  value={filters.issueType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="spam">Spam or Misleading</option>
                  <option value="fake">Fake Product/Counterfeit</option>
                  <option value="pricing">Wrong Pricing</option>
                  <option value="outdated">Outdated Information</option>
                  <option value="other">Other Issues</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-black rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-950/20 border-b border-green-100 dark:border-green-900/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Reports</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Pending</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Resolved</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Last Report</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100 dark:divide-green-900/30">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <Shield size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No reported products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.product._id} className="hover:bg-green-50/30 dark:hover:bg-green-950/10 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.product.thumbnail ? (
                            <img src={item.product.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Package size={16} className="text-green-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{item.product.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {item.product._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.product.brand}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium">
                          <AlertTriangle size={12} />
                          {item.reportCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm font-medium">
                          <Clock size={12} />
                          {item.pendingCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium">
                          <CheckCircle size={12} />
                          {item.resolvedCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.lastReportDate ? new Date(item.lastReportDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewProductReports(item)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all flex items-center gap-2"
                          >
                            <Eye size={14} />
                            View Reports
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="px-6 py-4 border-t border-green-100 dark:border-green-900/30 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of {pagination.totalProducts} products
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Reports Modal */}
      {showReportsModal && viewingReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white dark:bg-black rounded-2xl shadow-2xl border border-green-100 dark:border-green-900 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-white" size={20} />
                <h2 className="text-xl font-bold text-white">Product Reports</h2>
              </div>
              <button onClick={() => setShowReportsModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 border-b border-green-100 dark:border-green-900/30 bg-green-50/30 dark:bg-green-950/10">
              <div className="flex gap-4">
                {viewingReports.product.thumbnail ? (
                  <img src={viewingReports.product.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Package size={32} className="text-green-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{viewingReports.product.title}</h3>
                  <p className="text-green-600 dark:text-green-400 text-sm">Brand: {viewingReports.product.brand}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-gray-500">Total Reports: {viewingReports.reportCount}</span>
                    <span className="text-xs text-yellow-600">Pending: {viewingReports.pendingCount}</span>
                    <span className="text-xs text-green-600">Resolved: {viewingReports.resolvedCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {viewingReports.reports.map((report) => (
                <div key={report._id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getIssueIcon(report.issueType)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{report.issueType}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{report.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.message}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Reported by: {report.reportedBy?.name}</p>
                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowReportsModal(false);
                          setShowResponseModal(true);
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all flex items-center gap-2"
                      >
                        <MessageCircle size={14} />
                        Respond
                      </button>
                    )}
                  </div>
                  {report.sellerResponse?.message && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Your Response:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{report.sellerResponse.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Responded: {new Date(report.sellerResponse.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600"></div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-black rounded-2xl shadow-2xl border border-green-100 dark:border-green-900 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-white" size={20} />
                <h2 className="text-xl font-bold text-white">Respond to Report</h2>
              </div>
              <button onClick={() => setShowResponseModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Report Details</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Issue:</strong> {selectedReport.issueType}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Subject:</strong> {selectedReport.subject}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2"><strong>Message:</strong></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedReport.message}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Your Response <span className="text-green-500">*</span>
                </label>
                <textarea
                  rows="6"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Please provide your response to this report. Explain your side or provide evidence..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-green-200 dark:border-green-800 rounded-xl focus:ring-2 focus:ring-green-500 resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 5 characters</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="flex-1 px-4 py-2.5 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRespond}
                  disabled={submitting || !responseText.trim() || responseText.trim().length < 5}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Response
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedProducts;