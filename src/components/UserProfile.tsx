import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Camera, 
  Edit, 
  Save, 
  X, 
  Award, 
  Star, 
  TrendingUp,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Trophy,
  Target,
  Zap,
  Activity,
  Upload,
  CheckCircle,
  Clock,
  Lightbulb,
  ShoppingBag
} from 'lucide-react';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.profile?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    phone: ''
  });

  // Mock user stats and achievements
  const userStats = {
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    totalProjects: 24,
    co2Saved: 45.6,
    wasteProcessed: 18.2,
    communityRank: 156,
    joinDate: user?.profile?.join_date || new Date().toISOString()
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first upcycling project', icon: '🌱', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Eco Warrior', description: 'Save 10kg of CO₂', icon: '⚔️', earned: true, date: '2024-02-20' },
    { id: 3, name: 'Community Helper', description: 'Help 5 community members', icon: '🤝', earned: true, date: '2024-03-10' },
    { id: 4, name: 'Master Creator', description: 'Complete 20 projects', icon: '🏆', earned: true, date: '2024-03-25' },
    { id: 5, name: 'Marketplace Star', description: 'Sell 10 items in marketplace', icon: '⭐', earned: false, date: null },
    { id: 6, name: 'Planet Saver', description: 'Save 50kg of CO₂', icon: '🌍', earned: false, date: null }
  ];

  const recentActivities = [
    { id: 1, type: 'project', title: 'Completed "Garden Planter from Plastic Bottles"', time: '2 hours ago', xp: 150 },
    { id: 2, type: 'marketplace', title: 'Sold "Upcycled Wooden Shelf"', time: '1 day ago', xp: 100 },
    { id: 3, type: 'community', title: 'Liked 5 community projects', time: '2 days ago', xp: 25 },
    { id: 4, type: 'achievement', title: 'Earned "Master Creator" badge', time: '3 days ago', xp: 200 },
    { id: 5, type: 'project', title: 'Uploaded new project photos', time: '5 days ago', xp: 50 }
  ];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you'd upload to storage and update the profile
        console.log('Avatar uploaded:', e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name: profileData.name,
        // Add other profile fields as needed
      });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'marketplace': return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      case 'community': return <User className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const availableAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-32"></div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
              <div className="relative">
                <img
                  src={user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt={user?.profile?.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user?.profile?.name || user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-gray-600 capitalize">
                      {user?.profile?.role || 'user'} • Level {userStats.level}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(userStats.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setEditing(!editing)}
                    className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
                
                {/* Level Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Level {userStats.level}</span>
                    <span>{userStats.xp} / {userStats.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Achievements */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Your Impact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <Lightbulb className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Projects</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.totalProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">CO₂ Saved</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.co2Saved}kg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Waste Processed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.wasteProcessed}kg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-orange-100 rounded-full p-2 mr-3">
                      <Trophy className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700">Community Rank</span>
                  </div>
                  <span className="font-semibold text-gray-900">#{userStats.communityRank}</span>
                </div>
              </div>
            </div>

            {/* Earned Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Achievements ({earnedAchievements.length})
              </h3>
              <div className="space-y-3">
                {earnedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">Earned {new Date(achievement.date!).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-gray-600" />
                Next Goals ({availableAchievements.length})
              </h3>
              <div className="space-y-3">
                {availableAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60">
                    <span className="text-2xl grayscale">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {editing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-3 py-1 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? <Clock className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.name || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {profileData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {profileData.location || 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {editing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      {profileData.website || 'Not set'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself and your upcycling journey..."
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.bio || 'No bio added yet.'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <span className="text-xs font-medium text-green-600">+{activity.xp} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}