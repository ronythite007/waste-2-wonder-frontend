import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { useMarketplace } from '../contexts/MarketplaceContext';
import type { Suggestion } from '../lib/supabase';
import { 
  Upload, 
  Lightbulb, 
  ShoppingBag, 
  TreePine, 
  TrendingUp,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserWasteItems, getSavedSuggestions, savedSuggestions } = useWaste();
  const { getProductsByUser } = useMarketplace();

  const userWasteItems = getUserWasteItems(user?.id || '');
  const userProducts = getProductsByUser(user?.id || '');
  
  useEffect(() => {
    if (user) {
      // Fetch saved suggestions when component mounts
      getSavedSuggestions();
    }
  }, [user, getSavedSuggestions]);

  // Calculate eco metrics from saved suggestions
  const ecoMetrics = savedSuggestions.reduce((acc, suggestion: Suggestion) => {
    const impact = suggestion.eco_impact || {};
    return {
      co2: acc.co2 + (impact.co2Saved || 0),
      water: acc.water + (impact.wasteReduced || 0),
      energy: acc.energy + (impact.energySaved || 0)
    };
  }, { co2: 0, water: 0, energy: 0 });

  const stats = [
    {
      title: 'Items Upcycled',
      value: userWasteItems.length,
      icon: () => (
        <img src="/logo.png" alt="logo" className="h-6 w-6 md:h-7 md:w-7 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      ),
      color: 'bg-green-500',
      change: '+12%'
    },
    {
      title: 'Products Listed',
      value: userProducts.length,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+8%'
    },
    {
      title: 'CO2 Saved',
      value: `${ecoMetrics.co2.toFixed(1)}kg`,
      icon: TreePine,
      color: 'bg-emerald-500',
      change: '+15%'
    },
    {
      title: 'Saved Ideas',
      value: savedSuggestions.length,
      icon: Lightbulb,
      color: 'bg-yellow-500',
      change: `+${savedSuggestions.length > 0 ? Math.round((savedSuggestions.length / userWasteItems.length) * 100) : 0}%`
    },
    {
      title: 'Eco Score',
      value: '850',
      icon: Award,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const quickActions = [
    {
      title: 'Upload Waste',
      description: 'Add a new waste item to get AI suggestions',
      icon: Upload,
      link: '/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'View Suggestions',
      description: 'Browse AI-generated upcycling ideas',
      icon: Lightbulb,
      link: '/suggestions',
      color: 'bg-yellow-500'
    },
    {
      title: 'Marketplace',
      description: 'Buy or sell upcycled products',
      icon: ShoppingBag,
      link: '/marketplace',
      color: 'bg-purple-500'
    },
    {
      title: 'Eco Tracker',
      description: 'Monitor your environmental impact',
      icon: TreePine,
      link: '/eco-tracker',
      color: 'bg-green-500'
    }
  ];

  const recentActivity = [
    { type: 'upload', message: 'Uploaded plastic bottle for upcycling', time: '2 hours ago' },
    { type: 'suggestion', message: 'Generated 3 DIY suggestions for cardboard box', time: '5 hours ago' },
    { type: 'marketplace', message: 'Listed upcycled planter for sale', time: '1 day ago' },
    { type: 'achievement', message: 'Earned "Green Starter" badge', time: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.profile?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your eco-journey today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-full p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`${action.color} rounded-full p-3 w-fit mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
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
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      {activity.type === 'upload' && <Upload className="h-4 w-4 text-green-600" />}
                      {activity.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-yellow-600" />}
                      {activity.type === 'marketplace' && <ShoppingBag className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'achievement' && <Award className="h-4 w-4 text-orange-600" />}
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

      {/* Recent Saved Suggestions Section */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
              Recent Saved Ideas
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSuggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                      {suggestion.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{suggestion.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{suggestion.time_required}</span>
                    <Link
                      to="/eco-tracker?tab=suggestions"
                      className="text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
              {savedSuggestions.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Lightbulb className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-gray-600">No saved ideas yet. Start exploring suggestions!</p>
                </div>
              )}
            </div>
            {savedSuggestions.length > 3 && (
              <div className="mt-4 text-center">
                <Link
                  to="/suggestions?tab=suggestions"
                  className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  View All Saved Ideas
                  <TrendingUp className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}