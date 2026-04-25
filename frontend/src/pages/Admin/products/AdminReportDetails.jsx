import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, XCircle, Clock, Shield, Send,
  User, Package, Calendar, Mail, Flag, AlertTriangle, Star, Edit2,
  ArrowLeft, Save, RefreshCw, MessageCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById, updateReport } from '../../../utils/product.apiRequest';

const AdminReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    priority: '',
    action: '',
    adminRemarks: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch report details
  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const response = await getReportById(id);
      if (response.success) {
        setReport(response.data);
        setUpdateData({
          status: response.data.report.status,
          priority: response.data.report.priority,
          action: response.data.report.actionTaken || 'none',
          adminRemarks: response.data.report.adminRemarks || ''
        });
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReportDetails();
    }
  }, [id]);

  // Handle unified update
  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const response = await updateReport(id, updateData);
      if (response.success) {
        await fetchReportDetails();
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert(error.message || 'Failed to update report');
    } finally {
      setSubmitting(false);
    }
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

  const getIssueInfo = (type) => {
    const issues = {
      inappropriate: { icon: <AlertTriangle size={18} />, label: 'Inappropriate Content' },
      spam: { icon: <Flag size={18} />, label: 'Spam or Misleading' },
      fake: { icon: <Package size={18} />, label: 'Fake Product/Counterfeit' },
      pricing: { icon: <Star size={18} />, label: 'Wrong Pricing' },
      outdated: { icon: <Calendar size={18} />, label: 'Outdated Information' },
      other: { icon: <Mail size={18} />, label: 'Other Issues' }
    };
    return issues[type] || issues.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Report not found</p>
          <button
            onClick={() => navigate('/admin/reported-items')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { report: reportData, productDetails } = report;
  const issueInfo = getIssueInfo(reportData.issueType);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">

        {/* Main Card */}
        <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-red-100 dark:border-red-900 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-white" size={24} />
              <div>
                <h2 className="text-xl font-bold text-white">Report Details</h2>
                <p className="text-red-100 text-sm">Report ID: {reportData.reportId}</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-all flex items-center gap-2"
            >
              <Edit2 size={14} />
              Edit Report
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Status and Priority Badges */}
            <div className="flex gap-3 flex-wrap">
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(reportData.status)}`}>
                Status: {reportData.status}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${getPriorityBadge(reportData.priority)}`}>
                Priority: {reportData.priority}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Action: {reportData.actionTaken || 'None'}
              </span>
            </div>

            {/* Product Information */}
            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-5 border border-red-100 dark:border-red-900/30">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                <Package size={20} />
                Product Information
              </h3>
              <div className="flex gap-5 flex-wrap md:flex-nowrap">
                {productDetails?.thumbnail ? (
                  <img 
                    src={productDetails.thumbnail} 
                    alt={productDetails.title}
                    className="w-24 h-24 rounded-lg object-cover border border-red-200 dark:border-red-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border border-red-200 dark:border-red-800">
                    <Package size={40} className="text-red-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{productDetails?.title}</h4>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">Brand: {productDetails?.brand}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Category: {productDetails?.category}
                    {productDetails?.subCategory && ` > ${productDetails.subCategory}`}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                    <span>Total Stock: {productDetails?.totalStock}</span>
                    <span>Total Sold: {productDetails?.totalSold}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            {productDetails?.seller && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <User size={20} />
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <p className="text-sm"><strong>Name:</strong> {productDetails.seller.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {productDetails.seller.email}</p>
                  {productDetails.sellerPanel?.brandName && (
                    <p className="text-sm"><strong>Brand:</strong> {productDetails.sellerPanel.brandName}</p>
                  )}
                  {productDetails.sellerPanel?.storeName && (
                    <p className="text-sm"><strong>Store:</strong> {productDetails.sellerPanel.storeName}</p>
                  )}
                </div>
              </div>
            )}

            {/* Report Details */}
            <div className="bg-white dark:bg-black rounded-xl p-5 border border-red-100 dark:border-red-900/30">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                {issueInfo.icon}
                Report Content
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issue Type</label>
                  <p className="mt-1 text-gray-900 dark:text-white capitalize">{issueInfo.label}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject / Regarding</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{reportData.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message / Description</label>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reportData.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reported By</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{reportData.reportedBy?.name}</p>
                    <p className="text-xs text-gray-500">{reportData.reportedBy?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reported On</label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {new Date(reportData.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Remarks */}
            {reportData.adminRemarks && (
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Admin Remarks
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{reportData.adminRemarks}</p>
                {reportData.resolvedBy && (
                  <p className="text-sm text-gray-500 mt-2">
                    Resolved by: {reportData.resolvedBy?.name} on {new Date(reportData.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Seller Response */}
            {reportData.sellerResponse?.message && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-5 border border-green-100 dark:border-green-900/30">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                  <MessageCircle size={20} />
                  Seller Response
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{reportData.sellerResponse.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Responded on: {new Date(reportData.sellerResponse.respondedAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* Related Reports */}
            {report.relatedReports?.list?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Related Reports ({report.relatedReports.count})
                </h3>
                <div className="space-y-2">
                  {report.relatedReports.list.map((related) => (
                    <div key={related._id} className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{related.reportId}</p>
                        <p className="text-xs text-gray-500">{related.issueType} - {related.status}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(related.priority)}`}>
                        {related.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600"></div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-black rounded-2xl shadow-2xl border border-red-100 dark:border-red-900 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit2 className="text-white" size={20} />
                <h2 className="text-xl font-bold text-white">Update Report</h2>
              </div>
              <button onClick={() => setShowUpdateModal(false)} className="p-2 hover:bg-white/20 rounded-lg text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              
              {/* Status Update */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              {/* Priority Update */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={updateData.priority}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Action Update */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  Action to Take
                </label>
                <select
                  value={updateData.action}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, action: e.target.value }))}
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
                  value={updateData.adminRemarks}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, adminRemarks: e.target.value }))}
                  placeholder="Add any additional remarks or notes..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/60 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Update Report
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

export default AdminReportDetails;