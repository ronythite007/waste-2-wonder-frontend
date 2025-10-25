import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { 
  Lightbulb, 
  Clock, 
  Wrench, 
  Star, 
  Play,
  Search,
  Filter
} from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_required: string;
  tools: string[];
  materials: string[];
  estimated_cost: string;
  steps: string[];
  safety_tips: string[];
  eco_impact: {
    co2Saved: number;
    wasteReduced: number;
    energySaved: number;
  };
  video_search_query: string;
}

export default function Suggestions() {
  const { user, session } = useAuth();
  const { getUserWasteItems, generateSuggestions, suggestions } = useWaste();
  const [loading, setLoading] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [savedSuggestions, setSavedSuggestions] = useState<Suggestion[]>([]);
  const [fetchingSaved, setFetchingSaved] = useState(false);

  const userWasteItems = getUserWasteItems(user?.id || '');
  
  // Combine both generated and saved suggestions
  const allSuggestions = [...suggestions, ...savedSuggestions];

  const fetchSavedSuggestions = useCallback(async () => {
    if (!user?.id || !session?.access_token) return;

    setFetchingSaved(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/suggestions?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSavedSuggestions(data.suggestions);
      } else {
        console.error('Failed to fetch saved suggestions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching saved suggestions:', error);
    } finally {
      setFetchingSaved(false);
    }
  }, [user?.id, session?.access_token]);

  useEffect(() => {
    if (user?.id && session?.access_token) {
      fetchSavedSuggestions();
    }
  }, [user?.id, session?.access_token, fetchSavedSuggestions]);

  const handleGenerateSuggestions = async (wasteId: string) => {
    setLoading(true);
    try {
      await generateSuggestions(wasteId);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = allSuggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !difficultyFilter || suggestion.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getYouTubeSearchUrl = (title: string) => {
    const query = encodeURIComponent(`${title} DIY tutorial`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Lightbulb className="h-8 w-8 mr-3 text-yellow-500" />
            AI Upcycling Suggestions
          </h1>
          <p className="mt-2 text-gray-600">
            Get creative ideas and step-by-step instructions for your waste items
          </p>
        </div>

        {/* Generate Suggestions Section */}
        {userWasteItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generate New Suggestions
            </h2>
            <div className="flex flex-wrap gap-4">
              {userWasteItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleGenerateSuggestions(item.id)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  <span>{item.type}</span>
                  <span className="text-xs bg-green-200 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
            {loading && (
              <div className="mt-4 flex items-center text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                Generating AI suggestions...
              </div>
            )}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Suggestions Grid */}
        {filteredSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggestions.map(suggestion => (
              <div key={suggestion.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {suggestion.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                      {suggestion.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {suggestion.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-4">{suggestion.time_required}</span>
                    <Wrench className="h-4 w-4 mr-1" />
                    <span>{suggestion.tools.length} tools</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Required Tools:</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.tools.map((tool, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Materials:</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.materials.map((material, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  {suggestion.estimated_cost && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Estimated Cost:</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                        {suggestion.estimated_cost}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {suggestion.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {suggestion.safety_tips && suggestion.safety_tips.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="text-yellow-500 mr-1">⚠️</span>
                        Safety Tips:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {suggestion.safety_tips.map((tip: string, index: number) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestion.eco_impact && (
                    <div className="mb-6 bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Environmental Impact:</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-green-700">{suggestion.eco_impact.co2Saved}kg</div>
                          <div className="text-green-600">CO2 Saved</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-700">{suggestion.eco_impact.wasteReduced}kg</div>
                          <div className="text-green-600">Waste Reduced</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-700">{suggestion.eco_impact.energySaved}kWh</div>
                          <div className="text-green-600">Energy Saved</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <a
                      href={getYouTubeSearchUrl(suggestion.video_search_query || suggestion.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Tutorial
                    </a>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No suggestions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload a waste item to get AI-powered upcycling suggestions
            </p>
            <a
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Upload Waste Item
            </a>
          </div>
        )}
      </div>
    </div>
  );
}