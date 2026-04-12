import React from 'react';
import { 
  Users, Package, DollarSign, Crown, TrendingUp, 
  Eye, MoreVertical, CheckCircle, Clock, XCircle,
  HardDrive, Image, FileText, ArrowUpRight, Star,
  Flame, Activity, Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '42,891', icon: Users, change: '+12%', changeType: 'up' },
    { label: 'Active Listings', value: '8,102', icon: Package, change: '+8%', changeType: 'up' },
    { label: 'Gross Revenue', value: '$1.24M', icon: DollarSign, change: '+23%', changeType: 'up' },
    { label: 'Active Sellers', value: '1,456', icon: Crown, change: '+5%', changeType: 'up' }
  ];

  const hotListings = [
    { name: "Gibson '59 Reissue", bids: 42, price: '$8,500', image: '🎸' },
    { name: 'PRS Custom 24', bids: 15, price: '$4,200', image: '🎸' },
    { name: 'Fender Precision', bids: 28, price: '$1,800', image: '🎸' }
  ];

  const sellerActivity = [
    { seller: 'Velvet Audio', location: 'Nashville, TN', verified: true, rating: 5, status: 'Active Now', statusColor: 'green' },
    { seller: 'Custom Shop Ltd.', location: 'London, UK', verified: true, rating: 5, status: 'Idle', statusColor: 'yellow' },
    { seller: 'Rhythm & Tone', location: 'Austin, TX', verified: false, rating: 4, status: 'Active', statusColor: 'green' },
    { seller: 'Vintage Vibes', location: 'Tokyo, JP', verified: true, rating: 5, status: 'Offline', statusColor: 'gray' }
  ];

  const storageData = [
    { label: 'Product Images', used: '1.2 TB', percentage: 45 },
    { label: 'User Data', used: '420 GB', percentage: 32 },
    { label: 'Site Logs', used: '85 GB', percentage: 12 }
  ];

  if (!isAuthenticated || user.role !== 'admin') {
    return null;
  }


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Heart Rhythm 
          <span className={`${isDark ? 'text-red-500' : 'text-red-600'} glow-text`}>Management Console</span>
          <Flame className={`w-8 h-8 ${isDark ? 'text-red-500' : 'text-red-600'} animate-pulse`} />
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Real-time performance of the Heart Rhythm ecosystem.
        </p>
      </div>

      <div>
        {isAuthenticated && (
          <>
          <p className='text-xl font-medium'>Welcome, {user.name}!</p>
          <p className='ml-4 text-xl'>to the Admin Dashbord</p>

          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${isDark ? 'bg-black/50 border-red-500/30' : 'bg-white border-red-200/50'} rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:shadow-red-500/20 transition-all group glow-border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${isDark ? 'bg-red-900/30' : 'bg-red-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
              </div>
              <span className={`text-sm font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${stat.changeType === 'up' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30'}`}>
                <ArrowUpRight size={14} />
                {stat.change}
              </span>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Growth Chart */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-black/50 border-red-500/30' : 'bg-white border-red-200/50'} rounded-2xl p-6 shadow-lg border glow-border`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Revenue & Growth Pulse</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Weekly performance metrics</p>
            </div>
            <div className="flex gap-2">
              <button className={`px-3 py-1.5 text-sm font-medium ${isDark ? 'text-red-500 bg-red-950/50' : 'text-red-600 bg-red-50'} rounded-lg`}>Revenue</button>
              <button className={`px-3 py-1.5 text-sm font-medium ${isDark ? 'text-gray-400 hover:bg-red-950/30' : 'text-gray-600 hover:bg-red-50'} rounded-lg transition-colors`}>Growth</button>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-64 mt-4">
            <div className="flex items-end justify-between h-full gap-3">
              {[65, 78, 72, 89, 95, 82, 91].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full bg-gradient-to-t from-red-500 to-red-700 rounded-t-lg transition-all hover:opacity-80 shadow-lg shadow-red-500/30`} 
                       style={{ height: `${height}%` }}></div>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hottest Listings */}
        <div className={`${isDark ? 'bg-black/50 border-red-500/30' : 'bg-white border-red-200/50'} rounded-2xl p-6 shadow-lg border glow-border`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Hottest Listings</h3>
            <button className={`text-sm ${isDark ? 'text-red-500 hover:text-red-400' : 'text-red-600 hover:text-red-700'} font-medium`}>View All →</button>
          </div>
          <div className="space-y-4">
            {hotListings.map((listing, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 ${isDark ? 'hover:bg-red-950/30' : 'hover:bg-red-50'} rounded-xl transition-colors`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${isDark ? 'bg-gradient-to-br from-red-950 to-red-900' : 'bg-gradient-to-br from-red-100 to-red-50'} rounded-xl flex items-center justify-center text-2xl`}>
                    {listing.image}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{listing.name}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{listing.bids} bids • {listing.price}</p>
                  </div>
                </div>
                <button className={`${isDark ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}>
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller Activity Log */}
      <div className={`${isDark ? 'bg-black/50 border-red-500/30' : 'bg-white border-red-200/50'} rounded-2xl shadow-lg border overflow-hidden glow-border`}>
        <div className={`p-6 border-b ${isDark ? 'border-red-500/30' : 'border-red-200/50'}`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Seller Activity Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-red-950/30' : 'bg-red-50'}>
              <tr className="text-left">
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Seller</th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Verification</th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Rating</th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                <th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Action</th>
               </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-red-500/20' : 'divide-red-100'}`}>
              {sellerActivity.map((seller, idx) => (
                <tr key={idx} className={`${isDark ? 'hover:bg-red-950/30' : 'hover:bg-red-50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{seller.seller}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{seller.location}</p>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    {seller.verified ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle size={14} />
                        <span className="text-sm">Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <Clock size={14} />
                        <span className="text-sm">Pending</span>
                      </span>
                    )}
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(seller.rating)].map((_, i) => (
                        <Star key={i} size={14} className={`fill-red-500 text-red-500`} />
                      ))}
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full
                      ${seller.statusColor === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        seller.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {seller.status}
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <button className={`${isDark ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-red-600'} transition-colors`}>
                      <MoreVertical size={18} />
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* Storage Usage */}
      <div className={`${isDark ? 'bg-black/50 border-red-500/30' : 'bg-white border-red-200/50'} rounded-2xl p-6 shadow-lg border glow-border`}>
        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Storage Usage</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Storage</span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>70% Used</span>
            </div>
            <div className={`w-full ${isDark ? 'bg-red-950/50' : 'bg-red-100'} rounded-full h-3`}>
              <div className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full shadow-lg shadow-red-500/30" style={{ width: '70%' }}></div>
            </div>
          </div>
          
          {storageData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.used}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-red-950/50' : 'bg-red-100'} rounded-full h-2`}>
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`pt-8 pb-4 text-center border-t ${isDark ? 'border-red-500/30' : 'border-red-200/50'}`}>
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
          <a href="#" className={`${isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-600'} transition-colors`}>THE STORY</a>
          <a href="#" className={`${isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-600'} transition-colors`}>CRAFTSMANSHIP</a>
          <a href="#" className={`${isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-600'} transition-colors`}>WARRANTY</a>
          <a href="#" className={`${isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-600'} transition-colors`}>RETURNS</a>
          <a href="#" className={`${isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-600'} transition-colors`}>PRIVACY</a>
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          © 2024 HEART RHYTHM. FEEL THE PULSE.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;