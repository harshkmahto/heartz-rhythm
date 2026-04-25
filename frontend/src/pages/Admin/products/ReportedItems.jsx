import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Edit2,
  Save,
  Activity
} from 'lucide-react';
import { getAllReports, updateReportStatus, takeActionOnReport, getReportStatistics } from '../../../utils/product.apiRequest';

const ReportedItems = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    limit: 10
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    issueType: '',
    search: '',
    fromDate: '',
    toDate: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Status Update Modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({
    status: '',
    adminRemarks: ''
  });
  
  // Action Update Modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionData, setActionData] = useState({
    action: 'none',
    adminRemarks: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  // Fetch reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters
      };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const response = await getAllReports(params);
      if (response.success) {
        setReports(response.data.reports);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalReports: response.data.pagination.totalReports
        }));
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getReportStatistics(30);
      if (response.success) {
        setStats(response.data.overview);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
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
      priority: '',
      issueType: '',
      search: '',
      fromDate: '',
      toDate: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Open Status Update Modal
  const openStatusModal = (report) => {
    setSelectedReport(report);
    setStatusData({
      status: report.status,
      adminRemarks: report.adminRemarks || ''
    });
    setShowStatusModal(true);
  };

  // Open Action Update Modal
  const openActionModal = (report) => {
    setSelectedReport(report);
    setActionData({
      action: report.actionTaken || 'none',
      adminRemarks: report.adminRemarks || ''
    });
    setShowActionModal(true);
  };

  // Handle Status Update
  const handleStatusUpdate = async () => {
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      const response = await updateReportStatus(selectedReport._id, statusData);
      if (response.success) {
        await fetchReports();
        await fetchStats();
        setShowStatusModal(false);
        setSelectedReport(null);
        setStatusData({ status: '', adminRemarks: '' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Action Update
  const handleActionUpdate = async () => {
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      const response = await takeActionOnReport(selectedReport._id, actionData);
      if (response.success) {
        await fetchReports();
        await fetchStats();
        setShowActionModal(false);
        setSelectedReport(null);
        setActionData({ action: 'none', adminRemarks: '' });
      }
    } catch (error) {
      console.error('Error updating action:', error);
      alert(error.message || 'Failed to update action');
    } finally {
      setSubmitting(false);
    }
  };

  // Navigate to report details
  const viewReportDetails = (reportId) => {
    navigate(`/admin/report/details/${reportId}`);
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

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    const styles = {
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return styles[priority] || styles.medium;
  };

  // Get issue type icon
  const getIssueIcon = (type) => {
    const icons = {
      inappropriate: <AlertTriangle size={16} />,
      spam: <Flag size={16} />,
      fake: <Package size={16} />,
      pricing: <Star size={16} />,
      outdated: <Calendar size={16} />,
      other: <Mail size={16} />
    };
    return icons[type] || <AlertCircle size={16} />;
  };

  // Stats cards data
  const statCards = [
    { label: 'Total Reports', value: stats?.totalReports || 0, icon: <Flag size={20} />, color: 'red' },
    { label: 'Pending', value: stats?.pending || 0, icon: <Clock size={20} />, color: 'yellow' },
    { label: 'Under Review', value: stats?.underReview || 0, icon: <Eye size={20} />, color: 'blue' },
    { label: 'Resolved', value: stats?.resolved || 0, icon: <CheckCircle size={20} />, color: 'green' },
    { label: 'Dismissed', value: stats?.dismissed || 0, icon: <XCircle size={20} />, color: 'gray' },
    { label: 'Urgent', value: stats?.urgent || 0, icon: <AlertCircle size={20} />, color: 'red' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="text-red-500" size={32} />
            Reported Items
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and review product reports from administrators
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-black rounded-xl p-4 border shadow-sm"
              style={{ borderColor: `${card.color === 'red' ? '#fecaca' : card.color === 'yellow' ? '#fef08a' : card.color === 'blue' ? '#bfdbfe' : card.color === 'green' ? '#bbf7d0' : '#e5e7eb'}` }}
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
        <div className="bg-white dark:bg-black rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm mb-6">
          {/* Search Bar */}
          <div className="p-4 border-b border-red-100 dark:border-red-900/30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by report ID, subject, or message..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                <Filter size={18} />
                Filters
                {(filters.status || filters.priority || filters.issueType || filters.fromDate || filters.toDate) && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                <X size={18} />
                Clear
              </button>
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Type</label>
                <select
                  name="issueType"
                  value={filters.issueType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500"
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
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Reports Table */}
        <div className="bg-white dark:bg-black rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Report ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Issue Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 dark:divide-red-900/30">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <Shield size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No reports found</p>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{report.reportId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {report.product?.thumbnail ? (
                            <img src={report.product.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <Package size={16} className="text-red-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{report.product?.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{report.product?.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getIssueIcon(report.issueType)}
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{report.issueType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{report.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(report.priority)}`}>
                          {report.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{report.reportedBy?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{report.reportedBy?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewReportDetails(report._id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all flex items-center gap-2"
                            title="View Details"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => openStatusModal(report)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all flex items-center gap-2"
                            title="Update Status"
                          >
                            <Activity size={14} />
                            Status
                          </button>
                          <button
                            onClick={() => openActionModal(report)}
                            className="px-3 py-1.5 border border-red-600 text-red-600 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center gap-2"
                            title="Take Action"
                          >
                            <Edit2 size={14} />
                            Action
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
          {!loading && reports.length > 0 && (
            <div className="px-6 py-4 border-t border-red-100 dark:border-red-900/30 flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalReports)} of {pagination.totalReports} reports
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-black rounded-2xl shadow-2xl border border-red-100 dark:border-red-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="text-white" size={20} />
                <h2 className="text-xl font-bold text-white">Update Status</h2>
              </div>
              <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Report Summary */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Report Summary</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Report ID:</strong> {selectedReport.reportId}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Product:</strong> {selectedReport.product?.title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Current Status:</strong> {selectedReport.status}</p>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  New Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={statusData.status}
                  onChange={(e) => setStatusData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              {/* Admin Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Admin Remarks
                </label>
                <textarea
                  rows="4"
                  value={statusData.adminRemarks}
                  onChange={(e) => setStatusData(prev => ({ ...prev, adminRemarks: e.target.value }))}
                  placeholder="Add remarks about this status change..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
          </div>
        </div>
      )}

      {/* Action Update Modal */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-black rounded-2xl shadow-2xl border border-red-100 dark:border-red-900 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit2 className="text-white" size={20} />
                <h2 className="text-xl font-bold text-white">Take Action</h2>
              </div>
              <button onClick={() => setShowActionModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Report Summary */}
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Report Summary</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Report ID:</strong> {selectedReport.reportId}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Product:</strong> {selectedReport.product?.title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Current Action:</strong> {selectedReport.actionTaken || 'None'}</p>
              </div>

              {/* Action Update */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Action to Take
                </label>
                <select
                  value={actionData.action}
                  onChange={(e) => setActionData(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="none">No Action</option>
                  <option value="warning">Send Warning</option>
                  <option value="product_hidden">Hide Product</option>
                  <option value="product_removed">Remove Product</option>
                  <option value="seller_warning">Warning to Seller</option>
                  <option value="seller_suspended">Suspend Seller</option>
                </select>
              </div>

              {/* Admin Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Admin Remarks
                </label>
                <textarea
                  rows="4"
                  value={actionData.adminRemarks}
                  onChange={(e) => setActionData(prev => ({ ...prev, adminRemarks: e.target.value }))}
                  placeholder="Add remarks about this action..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActionUpdate}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Apply Action
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedItems;