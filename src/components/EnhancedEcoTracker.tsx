import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { 
  TreePine, 
  Award, 
  TrendingUp, 
  Calendar,
  Recycle,
  Droplets,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Trophy,
  Medal,
  Star,
  Flame,
  Leaf,
  Globe,
  ChevronUp,
  ChevronDown,
  Info,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function EnhancedEcoTracker() {
  const { user } = useAuth();
  const { getUserWasteItems, getSavedSuggestions } = useWaste();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTab, setSelectedTab] = useState('overview');
  const savedSuggestions = getSavedSuggestions();

  const userWasteItems = getUserWasteItems(user?.id || '');

  // Enhanced eco statistics with more detailed tracking
  const ecoStats = {
    itemsUpcycled: userWasteItems.length,
    co2Saved: Math.round(userWasteItems.length * 2.5 * 100) / 100,
    waterSaved: Math.round(userWasteItems.length * 15.3 * 100) / 100,
    energySaved: Math.round(userWasteItems.length * 4.2 * 100) / 100,
    wasteReduced: Math.round(userWasteItems.length * 0.8 * 100) / 100,
    treesEquivalent: Math.round(userWasteItems.length * 0.1 * 100) / 100,
    plasticBottlesSaved: userWasteItems.length * 12,
    carbonFootprintReduction: Math.round(userWasteItems.length * 1.8 * 100) / 100
  };

  // Community rankings and leaderboard data
  const communityStats = {
    userRank: 156,
    totalUsers: 2847,
    percentile: 94.5,
    streakDays: 23,
    monthlyGoal: 50,
    monthlyProgress: 34
  };

  // Monthly trend data
  const monthlyData = [
    { month: 'Jan', items: 2, co2: 5.0, water: 30.6, energy: 8.4 },
    { month: 'Feb', items: 3, co2: 7.5, water: 45.9, energy: 12.6 },
    { month: 'Mar', items: 4, co2: 10.0, water: 61.2, energy: 16.8 },
    { month: 'Apr', items: 1, co2: 2.5, water: 15.3, energy: 4.2 },
    { month: 'May', items: 3, co2: 7.5, water: 45.9, energy: 12.6 },
    { month: 'Jun', items: 2, co2: 5.0, water: 30.6, energy: 8.4 }
  ];

  // Enhanced achievements with progress tracking
  const achievements = [
    { 
      id: 1, 
      name: 'Green Starter', 
      description: 'Complete your first upcycling project', 
      icon: '🌱', 
      earned: userWasteItems.length >= 1, 
      progress: Math.min(userWasteItems.length, 1),
      target: 1,
      xpReward: 100,
      category: 'Beginner'
    },
    { 
      id: 2, 
      name: 'Eco Warrior', 
      description: 'Upcycle 5 items', 
      icon: '⚔️', 
      earned: userWasteItems.length >= 5, 
      progress: Math.min(userWasteItems.length, 5),
      target: 5,
      xpReward: 250,
      category: 'Progress'
    },
    { 
      id: 3, 
      name: 'Planet Hero', 
      description: 'Save 10kg CO2', 
      icon: '🦸', 
      earned: ecoStats.co2Saved >= 10, 
      progress: Math.min(ecoStats.co2Saved, 10),
      target: 10,
      xpReward: 500,
      category: 'Impact'
    },
    { 
      id: 4, 
      name: 'Water Guardian', 
      description: 'Save 100L water', 
      icon: '💧', 
      earned: ecoStats.waterSaved >= 100, 
      progress: Math.min(ecoStats.waterSaved, 100),
      target: 100,
      xpReward: 400,
      category: 'Conservation'
    },
    { 
      id: 5, 
      name: 'Energy Master', 
      description: 'Save 50kWh energy', 
      icon: '⚡', 
      earned: ecoStats.energySaved >= 50, 
      progress: Math.min(ecoStats.energySaved, 50),
      target: 50,
      xpReward: 600,
      category: 'Efficiency'
    },
    { 
      id: 6, 
      name: 'Waste Warrior', 
      description: 'Reduce 20kg waste', 
      icon: '🗑️', 
      earned: ecoStats.wasteReduced >= 20, 
      progress: Math.min(ecoStats.wasteReduced, 20),
      target: 20,
      xpReward: 750,
      category: 'Reduction'
    }
  ];

  // Impact breakdown by category
  const impactData = [
    { category: 'Plastic', count: 8, co2: 20.0, percentage: 45, color: 'bg-blue-500' },
    { category: 'Paper', count: 4, co2: 10.0, percentage: 25, color: 'bg-green-500' },
    { category: 'Metal', count: 2, co2: 6.0, percentage: 15, color: 'bg-yellow-500' },
    { category: 'Glass', count: 1, co2: 3.0, percentage: 10, color: 'bg-purple-500' },
    { category: 'Textile', count: 1, co2: 2.0, percentage: 5, color: 'bg-pink-500' }
  ];

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: 'EcoChampion2024', avatar: '🏆', co2Saved: 156.7, items: 89, badge: 'Platinum' },
    { rank: 2, name: 'GreenMaster', avatar: '🌟', co2Saved: 142.3, items: 76, badge: 'Gold' },
    { rank: 3, name: 'UpcycleQueen', avatar: '👑', co2Saved: 128.9, items: 68, badge: 'Gold' },
    { rank: 4, name: 'WasteWarrior', avatar: '⚔️', co2Saved: 115.4, items: 62, badge: 'Silver' },
    { rank: 5, name: 'PlanetSaver', avatar: '🌍', co2Saved: 98.2, items: 54, badge: 'Silver' },
    { rank: 156, name: user?.profile?.name || 'You', avatar: '👤', co2Saved: ecoStats.co2Saved, items: ecoStats.itemsUpcycled, badge: 'Bronze' }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const availableAchievements = achievements.filter(a => !a.earned);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'suggestions', label: 'Saved Ideas', icon: Leaf }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Platinum': return 'text-purple-600 bg-purple-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Bronze': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
            <TreePine className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Environmental Impact Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track your eco-journey, earn achievements, and see how you're making a difference for our planet
          </p>
        </div>

        {/* Period Selection */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-lg">
            {['week', 'month', 'year', 'all-time'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
                  selectedPeriod === period
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Items Upcycled</p>
                    <p className="text-3xl font-bold text-gray-900">{ecoStats.itemsUpcycled}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +12% this month
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-4">
                    <Recycle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
                    <p className="text-3xl font-bold text-gray-900">{ecoStats.co2Saved}kg</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <TreePine className="h-3 w-3 mr-1" />
                      {ecoStats.treesEquivalent} trees equivalent
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-4">
                    <TreePine className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-cyan-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Water Saved</p>
                    <p className="text-3xl font-bold text-gray-900">{ecoStats.waterSaved}L</p>
                    <p className="text-sm text-cyan-600 flex items-center mt-1">
                      <Droplets className="h-3 w-3 mr-1" />
                      {ecoStats.plasticBottlesSaved} bottles worth
                    </p>
                  </div>
                  <div className="bg-cyan-100 rounded-full p-4">
                    <Droplets className="h-8 w-8 text-cyan-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Energy Saved</p>
                    <p className="text-3xl font-bold text-gray-900">{ecoStats.energySaved}kWh</p>
                    <p className="text-sm text-yellow-600 flex items-center mt-1">
                      <Zap className="h-3 w-3 mr-1" />
                      ${Math.round(ecoStats.energySaved * 0.12)} saved
                    </p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-4">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Community Ranking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-orange-500" />
                  Community Ranking
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Top {Math.round(communityStats.percentile)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">#{communityStats.userRank}</div>
                  <div className="text-sm text-gray-600">Your Rank</div>
                  <div className="text-xs text-gray-500">out of {communityStats.totalUsers.toLocaleString()}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{communityStats.streakDays}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                  <div className="flex items-center justify-center text-xs text-orange-600 mt-1">
                    <Flame className="h-3 w-3 mr-1" />
                    On fire!
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{communityStats.monthlyProgress}</div>
                  <div className="text-sm text-gray-600">Monthly Goal</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(communityStats.monthlyProgress / communityStats.monthlyGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{communityStats.percentile}%</div>
                  <div className="text-sm text-gray-600">Percentile</div>
                  <div className="text-xs text-blue-600 mt-1">Better than most!</div>
                </div>
              </div>
            </div>

            {/* Impact Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <PieChart className="h-6 w-6 mr-2 text-purple-500" />
                  Impact by Category
                </h3>
                <div className="space-y-4">
                  {impactData.map(item => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="font-medium text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{item.count} items</div>
                        <div className="text-sm text-gray-500">{item.co2}kg CO₂</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-6 w-6 mr-2 text-green-500" />
                  Recent Milestones
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Reached 15 items milestone!</div>
                      <div className="text-sm text-gray-600">Earned 200 XP • 2 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 rounded-full p-1">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Unlocked "Eco Warrior" badge</div>
                      <div className="text-sm text-gray-600">Earned 250 XP • 5 days ago</div>
                      
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="bg-purple-500 rounded-full p-1">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Climbed to top 20%</div>
                      <div className="text-sm text-gray-600">Community ranking • 1 week ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {selectedTab === 'achievements' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earned Achievements */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-yellow-500" />
                  Earned Achievements ({earnedAchievements.length})
                </h3>
                <div className="space-y-4">
                  {earnedAchievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                            +{achievement.xpReward} XP
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-yellow-700 font-medium">{achievement.category}</span>
                          <span className="text-xs text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Achievements */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 mr-2 text-gray-500" />
                  Next Goals ({availableAchievements.length})
                </h3>
                <div className="space-y-4">
                  {availableAchievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-3xl opacity-50">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                            +{achievement.xpReward} XP
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 font-medium">{achievement.category}</span>
                          <span className="text-xs text-gray-500">
                            {achievement.progress.toFixed(1)} / {achievement.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {selectedTab === 'trends' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
                Monthly Progress Trends
              </h3>
              <div className="space-y-6">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-gray-900 w-12">{data.month}</div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{data.items}</div>
                          <div className="text-xs text-gray-500">Items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">{data.co2}kg</div>
                          <div className="text-xs text-gray-500">CO₂</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-600">{data.water}L</div>
                          <div className="text-xs text-gray-500">Water</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-yellow-600">{data.energy}kWh</div>
                          <div className="text-xs text-gray-500">Energy</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(data.items / 4) * 100}%` }}
                        ></div>
                      </div>
                      {index > 0 && data.items > monthlyData[index - 1].items && (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      )}
                      {index > 0 && data.items < monthlyData[index - 1].items && (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saved Suggestions Tab */}
        {selectedTab === 'suggestions' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-green-500" />
                Saved Upcycling Ideas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{suggestion.title}</h4>
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                        {suggestion.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {suggestion.time_required}
                      </div>
                      {suggestion.materials && suggestion.materials.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {suggestion.materials.map((material, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {material}
                            </span>
                          ))}
                        </div>
                      )}
                      {suggestion.tools && suggestion.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {suggestion.tools.map((tool, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-green-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Est. Cost: {suggestion.estimated_cost}
                          </span>
                          <button className="text-green-600 hover:text-green-800 flex items-center">
                            <Info className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {savedSuggestions.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Saved Ideas Yet</h4>
                  <p className="text-gray-600">Start saving upcycling ideas to see them here!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 'leaderboard' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-orange-500" />
                Community Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.rank} className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    user.name === (user?.profile?.name || 'You') 
                      ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.rank <= 3 ? (
                          user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="text-2xl">{user.avatar}</div>
                      <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.items} items upcycled</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{user.co2Saved}kg CO₂</div>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(user.badge)}`}>
                        {user.badge}
                      </div>
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