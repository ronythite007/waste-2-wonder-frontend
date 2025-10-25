import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { 
  Settings, 
  Users, 
  ShoppingBag, 
  Lightbulb, 
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const { wasteItems, suggestions } = useWaste();
  const { products } = useMarketplace();
  const [activeTab, setActiveTab] = useState('overview');

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalUploads: wasteItems.length,
    totalSuggestions: suggestions.length,
    totalProducts: products.length,
    co2Saved: 1234.5,
    waterSaved: 8765.2,
    energySaved: 4321.8
  };

  const recentActivity = [
    { type: 'user', message: 'New user registered: john@example.com', time: '2 minutes ago' },
    { type: 'upload', message: 'Waste item uploaded: Plastic bottle', time: '5 minutes ago' },
    { type: 'product', message: 'New product listed: Upcycled planter', time: '10 minutes ago' },
    { type: 'suggestion', message: 'AI suggestion generated for cardboard box', time: '15 minutes ago' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-blue-600" />
            Admin Panel
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your Waste2Wonder platform
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8%</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUploads}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15%</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CO2 Saved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.co2Saved}kg</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+25%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'upload' && <ShoppingBag className="h-4 w-4 text-purple-600" />}
                          {activity.type === 'product' && <ShoppingBag className="h-4 w-4 text-green-600" />}
                          {activity.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-yellow-600" />}
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            </div>
            <div className="p-6">
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
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full" src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">John Doe</div>
                            <div className="text-sm text-gray-500">john@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          User
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jan 15, 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded mb-2" />
                    <h3 className="font-medium text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {suggestions.map(suggestion => (
                  <div key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {suggestion.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">
                            {suggestion.timeRequired}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
                        Moderate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}