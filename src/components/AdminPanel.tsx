import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Settings, 
  Users, 
  ShoppingBag, 
  Lightbulb, 
  BarChart3,
  Eye,
  MessageSquare,
  Activity,
  Shield,
  Search,
  RefreshCw,
  Upload,
  Package
} from 'lucide-react';

// Type assertion for supabase
const supabaseClient = supabase as any;

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  created_at: string;
  wasteItems: any[];
  products: any[];
  posts: any[];
  suggestions: any[];
  savedSuggestions: any[];
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch all users with their data
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all data for each user
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          try {
            // Fetch waste items
            const { data: wasteItems } = await supabaseClient
              .from('waste_items')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false });

            // Fetch products
            const { data: products } = await supabaseClient
              .from('products')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false });

            // Fetch community posts
            const { data: posts } = await supabaseClient
              .from('community_posts')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false });

            // Fetch suggestions (linked via waste items)
            const wasteIds = wasteItems?.map((w: any) => w.id) || [];
            const { data: suggestions } = wasteIds.length > 0 
              ? await supabaseClient
                  .from('suggestions')
                  .select('*')
                  .in('waste_id', wasteIds)
                  .order('created_at', { ascending: false })
              : { data: [] };

            // Fetch saved suggestions
            const { data: savedSuggestions } = await supabaseClient
              .from('saved_suggestions')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false });

            return {
              ...profile,
              wasteItems: wasteItems || [],
              products: products || [],
              posts: posts || [],
              suggestions: suggestions || [],
              savedSuggestions: savedSuggestions || []
            };
          } catch (error) {
            console.error(`Error fetching data for user ${profile.id}:`, error);
            return {
              ...profile,
              wasteItems: [],
              products: [],
              posts: [],
              suggestions: [],
              savedSuggestions: []
            };
          }
        })
      );

      setAllUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.profile?.role === 'admin') {
      fetchAllUsers();
    }
  }, [user]);

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

  // Calculate statistics from real data
  const stats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.wasteItems.length > 0 || u.products.length > 0 || u.posts.length > 0).length,
    totalUploads: allUsers.reduce((sum, u) => sum + u.wasteItems.length, 0),
    totalSuggestions: allUsers.reduce((sum, u) => sum + u.suggestions.length, 0),
    totalSavedSuggestions: allUsers.reduce((sum, u) => sum + (u.savedSuggestions?.length || 0), 0),
    totalProducts: allUsers.reduce((sum, u) => sum + u.products.length, 0),
    totalPosts: allUsers.reduce((sum, u) => sum + u.posts.length, 0),
  };

  const recentActivity = [
    { type: 'upload', message: `${allUsers.reduce((sum, u) => sum + u.wasteItems.length, 0)} total waste items uploaded`, time: 'Recent', icon: Upload },
    { type: 'suggestion', message: `${allUsers.reduce((sum, u) => sum + u.suggestions.length, 0)} AI suggestions generated`, time: 'Recent', icon: Lightbulb },
    { type: 'saved', message: `${allUsers.reduce((sum, u) => sum + (u.savedSuggestions?.length || 0), 0)} saved suggestions`, time: 'Recent', icon: Lightbulb },
    { type: 'product', message: `${allUsers.reduce((sum, u) => sum + u.products.length, 0)} marketplace products`, time: 'Recent', icon: Package },
    { type: 'post', message: `${allUsers.reduce((sum, u) => sum + u.posts.length, 0)} community posts`, time: 'Recent', icon: MessageSquare },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'All Content', icon: Shield }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'creator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-blue-600" />
                Admin Control Panel
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Manage platform users and monitor all activity
              </p>
            </div>
            <button 
              onClick={fetchAllUsers}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedUser(null);
                }}
                className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium whitespace-nowrap transition-all text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-2 sm:p-3">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-2 sm:p-3">
                    <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Uploads</p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.totalUploads}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-2 sm:p-3">
                    <Upload className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Products</p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="bg-orange-100 rounded-full p-2 sm:p-3">
                    <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 border-l-4 border-yellow-500 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Suggestions</p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.totalSavedSuggestions}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-2 sm:p-3">
                    <Lightbulb className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Platform Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Waste Items</span>
                    <span className="font-semibold text-gray-900">{stats.totalUploads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Suggestions</span>
                    <span className="font-semibold text-gray-900">{stats.totalSuggestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold text-gray-900">{stats.totalProducts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Community Posts</span>
                    <span className="font-semibold text-gray-900">{stats.totalPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Saved Suggestions</span>
                    <span className="font-semibold text-gray-900">{stats.totalSavedSuggestions}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : selectedUser ? (
              <div className="space-y-6">
                {/* User Detail View */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <span className="mr-2">←</span> Back to Users
                  </button>
                  
                  <div className="flex items-start space-x-6">
                    <img 
                      src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.email}`}
                      alt={selectedUser.name}
                      className="h-24 w-24 rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                        <span className="text-sm text-gray-500">
                          Joined {new Date(selectedUser.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Posts</p>
                        <p className="text-2xl font-bold">{selectedUser.posts.length}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Uploads</p>
                        <p className="text-2xl font-bold">{selectedUser.wasteItems.length}</p>
                      </div>
                      <Upload className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Suggestions</p>
                        <p className="text-2xl font-bold">{selectedUser.suggestions.length}</p>
                      </div>
                      <Lightbulb className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Saved</p>
                        <p className="text-2xl font-bold">{selectedUser.savedSuggestions?.length || 0}</p>
                      </div>
                      <Lightbulb className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Products</p>
                        <p className="text-2xl font-bold">{selectedUser.products.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* User Posts */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Community Posts ({selectedUser.posts.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedUser.posts.length > 0 ? (
                      selectedUser.posts.map(post => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{post.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>Category: {post.category}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No posts yet</p>
                    )}
                  </div>
                </div>

                {/* User Waste Items */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-green-600" />
                    Waste Items ({selectedUser.wasteItems.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedUser.wasteItems.length > 0 ? (
                      selectedUser.wasteItems.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{item.type}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>Category: {item.category}</span>
                            <span>Condition: {item.condition}</span>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No waste items uploaded</p>
                    )}
                  </div>
                </div>

                {/* User Products */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-orange-600" />
                    Products ({selectedUser.products.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedUser.products.length > 0 ? (
                      selectedUser.products.map(product => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{product.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>Category: {product.category}</span>
                            <span>Type: {product.type}</span>
                            <span className="font-semibold text-green-600">${product.price}</span>
                            <span>{new Date(product.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No products listed</p>
                    )}
                  </div>
                </div>

                {/* User Saved Suggestions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Saved Suggestions ({selectedUser.savedSuggestions?.length || 0})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedUser.savedSuggestions && selectedUser.savedSuggestions.length > 0 ? (
                      selectedUser.savedSuggestions.map(suggestion => (
                        <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>Difficulty: {suggestion.difficulty}</span>
                            <span>Time: {suggestion.time_required}</span>
                            <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
                          </div>
                          {suggestion.materials && suggestion.materials.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700">Materials:</p>
                              <p className="text-xs text-gray-600">{suggestion.materials.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No saved suggestions</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="creator">Creator</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Users ({allUsers.length})</h3>
            </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploads</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                                <img 
                                  className="h-10 w-10 rounded-full" 
                                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                                  alt="" 
                                />
                          <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {user.role}
                        </span>
                      </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.posts.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.wasteItems.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.products.length}
                      </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                      </td>
                    </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* All Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                All Community Posts ({stats.totalPosts})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allUsers.flatMap(u => u.posts.map(post => ({...post, author: u.name, authorEmail: u.email})))
                  .map(post => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorEmail}`}
                          alt={post.author}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{post.title}</h4>
                          <p className="text-sm text-gray-600">{post.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>by {post.author}</span>
                            <span>Category: {post.category}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
            </div>
                    </div>
                  </div>
                ))}
                {stats.totalPosts === 0 && (
                  <p className="text-gray-500 text-center py-8">No posts found</p>
                )}
              </div>
            </div>

            {/* All Waste Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-green-600" />
                All Waste Items ({stats.totalUploads})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allUsers.flatMap(u => u.wasteItems.map(item => ({...item, author: u.name, authorEmail: u.email})))
                  .map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{item.type}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <span>by {item.author}</span>
                        <span>Category: {item.category}</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
                  ))}
                {stats.totalUploads === 0 && (
                  <p className="text-gray-500 text-center py-8">No waste items found</p>
                )}
              </div>
            </div>

            {/* All Products */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-orange-600" />
                All Products ({stats.totalProducts})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allUsers.flatMap(u => u.products.map(product => ({...product, author: u.name, authorEmail: u.email})))
                  .map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{product.title}</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <span>by {product.author}</span>
                        <span>Category: {product.category}</span>
                        <span className="font-semibold text-green-600">${product.price}</span>
                        <span>{new Date(product.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {stats.totalProducts === 0 && (
                  <p className="text-gray-500 text-center py-8">No products found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
