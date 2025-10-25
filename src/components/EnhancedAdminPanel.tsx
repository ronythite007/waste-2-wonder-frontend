import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useCommunity } from '../contexts/CommunityContext';
import { 
  Settings, 
  Users, 
  ShoppingBag, 
  Lightbulb, 
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  MessageSquare,
  Flag,
  Activity,
  Calendar,
  DollarSign,
  Award,
  Globe,
  Shield,
  Database,
  Server,
  Mail,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  PieChart,
  LineChart,
  UserPlus,
  UserMinus,
  Star,
  Heart,
  Share2
} from 'lucide-react';

export default function EnhancedAdminPanel() {
  const { user } = useAuth();
  const { wasteItems, suggestions } = useWaste();
  const { products } = useMarketplace();
  const { posts } = useCommunity();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (user?.profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  // Enhanced statistics
  const stats = {
    totalUsers: 2847,
    activeUsers: 1923,
    newUsersToday: 47,
    totalUploads: wasteItems.length,
    totalSuggestions: suggestions.length,
    totalProducts: products.length,
    totalPosts: posts.length,
    co2Saved: 12456.7,
    waterSaved: 87654.3,
    energySaved: 43218.9,
    revenue: 15420.50,
    conversionRate: 3.2,
    avgSessionTime: '8m 34s'
  };

  // Mock user data for admin management
  const mockUsers = [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'user', 
      status: 'active', 
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      projects: 12,
      sales: 5
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'creator', 
      status: 'active', 
      joinDate: '2024-02-20',
      lastActive: '1 day ago',
      projects: 28,
      sales: 15
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      role: 'user', 
      status: 'suspended', 
      joinDate: '2024-03-10',
      lastActive: '1 week ago',
      projects: 3,
      sales: 0
    }
  ];

  // Mock reports data
  const reportedContent = [
    {
      id: '1',
      type: 'post',
      title: 'Inappropriate content in community post',
      reporter: 'user123',
      reported: 'baduser456',
      reason: 'Spam/Inappropriate',
      status: 'pending',
      date: '2024-03-25'
    },
    {
      id: '2',
      type: 'product',
      title: 'Misleading product description',
      reporter: 'buyer789',
      reported: 'seller321',
      reason: 'Misleading information',
      status: 'resolved',
      date: '2024-03-24'
    }
  ];

  const recentActivity = [
    { type: 'user', message: 'New user registered: sarah@example.com', time: '2 minutes ago', icon: UserPlus },
    { type: 'product', message: 'Product "Upcycled Lamp" was reported', time: '15 minutes ago', icon: Flag },
    { type: 'upload', message: 'Waste item uploaded: Glass bottles', time: '32 minutes ago', icon: Upload },
    { type: 'suggestion', message: 'AI suggestion generated for cardboard box', time: '1 hour ago', icon: Lightbulb },
    { type: 'sale', message: 'Product sold: $45.99 commission earned', time: '2 hours ago', icon: DollarSign }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: MessageSquare },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'creator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-blue-600" />
                Admin Control Panel
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your Waste2Wonder platform and monitor community activity
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{stats.newUsersToday} today
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Content</p>
                    <p className="text-3xl font-bold text-gray-900">{(stats.totalUploads + stats.totalProducts + stats.totalPosts).toLocaleString()}</p>
                    <p className="text-sm text-purple-600 flex items-center mt-1">
                      <Upload className="h-3 w-3 mr-1" />
                      All platforms
                    </p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                    <p className="text-sm text-orange-600 flex items-center mt-1">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {stats.conversionRate}% conversion
                    </p>
                  </div>
                  <div className="bg-orange-100 rounded-full p-3">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  Platform Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Waste Items Uploaded</span>
                    <span className="font-semibold text-gray-900">{stats.totalUploads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Suggestions Generated</span>
                    <span className="font-semibold text-gray-900">{stats.totalSuggestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Marketplace Products</span>
                    <span className="font-semibold text-gray-900">{stats.totalProducts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Community Posts</span>
                    <span className="font-semibold text-gray-900">{stats.totalPosts}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Environmental Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CO₂ Saved (kg)</span>
                    <span className="font-semibold text-green-600">{stats.co2Saved.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Water Saved (L)</span>
                    <span className="font-semibold text-blue-600">{stats.waterSaved.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Energy Saved (kWh)</span>
                    <span className="font-semibold text-yellow-600">{stats.energySaved.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg Session Time</span>
                    <span className="font-semibold text-purple-600">{stats.avgSessionTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                              alt="" 
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Joined {user.joinDate}</div>
                          <div>Last active {user.lastActive}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{user.projects} projects</div>
                          <div>{user.sales} sales</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Ban className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-red-600" />
                Content Reports
              </h3>
              <div className="space-y-4">
                {reportedContent.map(report => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Reported by: <span className="font-medium">{report.reporter}</span></p>
                          <p>Reported user: <span className="font-medium">{report.reported}</span></p>
                          <p>Reason: <span className="font-medium">{report.reason}</span></p>
                          <p>Date: <span className="font-medium">{report.date}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Server className="h-5 w-5 mr-2 text-blue-600" />
                  System Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Maintenance Mode</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">User Registration</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">AI Suggestions</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                  Notification Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Notifications</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Report Alerts</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">System Updates</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}