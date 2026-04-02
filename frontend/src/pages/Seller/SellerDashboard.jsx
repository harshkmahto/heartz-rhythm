import React from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Package, ShoppingCart, Users, Eye, Calendar, Download,
  Filter, MoreVertical, BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SellerDashboard = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gradient-to-br from-emerald-50 via-white to-green-50'}`}>
      <div className="p-6 md:p-8 lg:p-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Welcome back, <span className={`bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent ${isDark ? 'glow-text' : ''}`}>John!</span>
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Revenue */}
          <div className={`${isDark ? 'bg-black/50 border-emerald-500/30 hover:shadow-emerald-500/30' : 'bg-white border-gray-100 hover:shadow-emerald-500/20'} rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group glow-border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <DollarSign className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100'}`}>
                <ArrowUpRight size={14} /> 14.2%
              </span>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>$142,850</p>
          </div>

          {/* Total Orders */}
          <div className={`${isDark ? 'bg-black/50 border-emerald-500/30 hover:shadow-emerald-500/30' : 'bg-white border-gray-100 hover:shadow-emerald-500/20'} rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group glow-border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <ShoppingCart className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100'}`}>
                <ArrowUpRight size={14} /> 8.4%
              </span>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Orders</h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>1,248</p>
          </div>

          {/* Products Sold */}
          <div className={`${isDark ? 'bg-black/50 border-emerald-500/30 hover:shadow-emerald-500/30' : 'bg-white border-gray-100 hover:shadow-emerald-500/20'} rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group glow-border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Package className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100'}`}>
                <ArrowUpRight size={14} /> 12.3%
              </span>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Products Sold</h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>3,542</p>
          </div>

          {/* Total Customers */}
          <div className={`${isDark ? 'bg-black/50 border-emerald-500/30 hover:shadow-emerald-500/30' : 'bg-white border-gray-100 hover:shadow-emerald-500/20'} rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group glow-border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Users className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100'}`}>
                <ArrowUpRight size={14} /> 18.2%
              </span>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Customers</h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>8,549</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Sales Chart */}
          <div className={`lg:col-span-2 ${isDark ? 'bg-black/50 border-emerald-500/30' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border glow-border`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Sales Overview</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Weekly sales performance</p>
              </div>
              <button className={`flex items-center gap-2 px-3 py-1.5 text-sm ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'} transition-colors`}>
                <Calendar size={16} />
                <span>This Week</span>
              </button>
            </div>
            
            {/* Chart Bars with Glow Effect */}
            <div className="flex items-end justify-between gap-3 h-64 mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const heights = [45, 62, 58, 78, 85, 92, 68];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-full bg-gradient-to-t from-emerald-500 to-green-500 rounded-t-lg transition-all duration-300 hover:opacity-80 ${isDark ? 'shadow-lg shadow-emerald-500/30' : ''}`} 
                         style={{ height: `${heights[idx]}%` }}></div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`${isDark ? 'bg-black/50 border-emerald-500/30' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-lg border glow-border`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Quick Stats</h3>
            <div className="space-y-4">
              <div className={`flex justify-between items-center p-3 ${isDark ? 'bg-emerald-950/30' : 'bg-gray-50'} rounded-xl`}>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Conversion Rate</span>
                <span className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>3.24%</span>
              </div>
              <div className={`flex justify-between items-center p-3 ${isDark ? 'bg-emerald-950/30' : 'bg-gray-50'} rounded-xl`}>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average Order Value</span>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>$114.50</span>
              </div>
              <div className={`flex justify-between items-center p-3 ${isDark ? 'bg-emerald-950/30' : 'bg-gray-50'} rounded-xl`}>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Refund Rate</span>
                <span className="text-lg font-bold text-red-500">2.1%</span>
              </div>
              <div className={`flex justify-between items-center p-3 ${isDark ? 'bg-emerald-950/30' : 'bg-gray-50'} rounded-xl`}>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Customer Satisfaction</span>
                <span className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>4.8/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className={`${isDark ? 'bg-black/50 border-emerald-500/30' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border overflow-hidden glow-border`}>
          <div className={`p-6 border-b ${isDark ? 'border-emerald-500/30' : 'border-gray-100'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Latest transactions from your store</p>
              </div>
              <div className="flex gap-2">
                <button className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'} transition-colors`}>
                  <Filter size={16} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/30">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-emerald-950/30' : 'bg-gray-50'}>
                <tr className="text-left">
                  <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Order ID</th>
                  <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customer</th>
                  <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount</th>
                  <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                  <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
                  <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Action</th>
                 </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-emerald-500/20' : 'divide-gray-100'}`}>
                {[
                  { id: '#HR-90210', name: 'Julian Drummers', amount: '$4,250.00', status: 'Shipped', date: '2024-03-28' },
                  { id: '#HR-88214', name: 'Alex Marshall', amount: '$2,890.00', status: 'Processing', date: '2024-03-27' },
                  { id: '#HR-77291', name: 'Sarah Koenig', amount: '$5,100.00', status: 'Pending', date: '2024-03-26' },
                  { id: '#HR-66123', name: 'Tom Richards', amount: '$3,450.00', status: 'Shipped', date: '2024-03-25' },
                  { id: '#HR-55432', name: 'Emma Peterson', amount: '$6,780.00', status: 'Processing', date: '2024-03-24' },
                ].map((order, idx) => (
                  <tr key={idx} className={`${isDark ? 'hover:bg-emerald-950/30' : 'hover:bg-emerald-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-mono font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{order.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full
                        ${order.status === 'Shipped' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          order.status === 'Processing' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{order.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className={`${isDark ? 'text-gray-500 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-600'} transition-colors`}>
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        /* Glow Effects for Dark Mode */
        .glow-text {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
        }
        
        .glow-border {
          transition: all 0.3s ease;
        }
        
        .dark .glow-border {
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.1);
        }
        
        .dark .glow-border:hover {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2);
        }
        
        /* Animation for bars */
        @keyframes rise {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        
        .dark .bg-gradient-to-t {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SellerDashboard;