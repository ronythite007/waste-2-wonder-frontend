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
  Target
} from 'lucide-react';

export default function EcoTracker() {
  const { user } = useAuth();
  const { getUserWasteItems } = useWaste();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const userWasteItems = getUserWasteItems(user?.id || '');

  const ecoStats = {
    itemsUpcycled: userWasteItems.length,
    co2Saved: Math.round(userWasteItems.length * 2.5 * 100) / 100,
    waterSaved: Math.round(userWasteItems.length * 15.3 * 100) / 100,
    energySaved: Math.round(userWasteItems.length * 4.2 * 100) / 100,
    wasteReduced: Math.round(userWasteItems.length * 0.8 * 100) / 100
  };

  const badges = [
    { name: 'Green Starter', description: 'Upcycled first item', earned: userWasteItems.length >= 1, icon: '🌱' },
    { name: 'Eco Warrior', description: 'Upcycled 5 items', earned: userWasteItems.length >= 5, icon: '⚔️' },
    { name: 'Planet Hero', description: 'Saved 10kg CO2', earned: ecoStats.co2Saved >= 10, icon: '🦸' },
    { name: 'Water Saver', description: 'Saved 50L water', earned: ecoStats.waterSaved >= 50, icon: '💧' },
    { name: 'Energy Master', description: 'Saved 20kWh energy', earned: ecoStats.energySaved >= 20, icon: '⚡' },
    { name: 'Waste Warrior', description: 'Reduced 5kg waste', earned: ecoStats.wasteReduced >= 5, icon: '🗑️' }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  const impactData = [
    { category: 'Plastic', count: 3, co2: 7.5, color: 'bg-blue-500' },
    { category: 'Paper', count: 2, co2: 5.0, color: 'bg-green-500' },
    { category: 'Metal', count: 1, co2: 3.0, color: 'bg-yellow-500' },
    { category: 'Glass', count: 1, co2: 2.0, color: 'bg-purple-500' }
  ];

  const monthlyData = [
    { month: 'Jan', items: 2, co2: 5.0 },
    { month: 'Feb', items: 3, co2: 7.5 },
    { month: 'Mar', items: 4, co2: 10.0 },
    { month: 'Apr', items: 1, co2: 2.5 },
    { month: 'May', items: 3, co2: 7.5 },
    { month: 'Jun', items: 2, co2: 5.0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TreePine className="h-8 w-8 mr-3 text-green-600" />
            Eco Impact Tracker
          </h1>
          <p className="mt-2 text-gray-600">
            Track your environmental impact and earn badges for your eco-friendly actions
          </p>
        </div>

        {/* Period Selection */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  selectedPeriod === period
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Upcycled</p>
                <p className="text-2xl font-bold text-gray-900">{ecoStats.itemsUpcycled}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CO2 Saved</p>
                <p className="text-2xl font-bold text-gray-900">{ecoStats.co2Saved}kg</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <TreePine className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Water Saved</p>
                <p className="text-2xl font-bold text-gray-900">{ecoStats.waterSaved}L</p>
              </div>
              <div className="bg-cyan-100 rounded-full p-3">
                <Droplets className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Energy Saved</p>
                <p className="text-2xl font-bold text-gray-900">{ecoStats.energySaved}kWh</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Impact by Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact by Category</h3>
            <div className="space-y-4">
              {impactData.map(item => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.count} items</p>
                    <p className="text-xs text-gray-500">{item.co2}kg CO2</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
            <div className="space-y-3">
              {monthlyData.map(data => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(data.items / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{data.items}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earned Badges */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Earned Badges ({earnedBadges.length})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.name} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Badges */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-gray-500" />
              Available Badges ({availableBadges.length})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {availableBadges.map(badge => (
                <div key={badge.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60">
                  <span className="text-2xl grayscale">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}