import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCommunity } from '../contexts/CommunityContext';
import { 
  Users, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Camera,
  X,
  Send,
  Bookmark,
  MoreHorizontal,
  Eye,
  ThumbsUp,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Tag,
  Filter,
  Search,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  ChevronDown,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const { 
    posts, 
    addPost, 
    likePost, 
    addComment, 
    bookmarkPost,
    deletePost,
    updatePost 
  } = useCommunity();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [imageError, setImageError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    materials: '',
    timeSpent: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    tags: '',
    tips: ''
  });

  const categories = [
    'Garden & Plants', 'Furniture', 'Wall Art', 'Lighting', 'Storage & Organization', 
    'Kitchen & Dining', 'Bathroom', 'Seasonal', 'Kids & Baby', 'Home Decor', 'Other'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Liked' },
    { value: 'comments', label: 'Most Discussed' }
  ];

  const handleImageUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image size must be less than 10MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      return;
    }
    
    setImageError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewPost(prev => ({ ...prev, image: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setNewPost(prev => ({ ...prev, image: '' }));
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const postData = {
      ...newPost,
      user_id: user.id,
      author: {
        name: user.name,
        avatar: user.avatar || '',
        role: user.role
      },
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: newPost.image || 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=500'
    };

    if (editingPost) {
      updatePost(editingPost.id, postData);
      setEditingPost(null);
    } else {
      addPost(postData);
    }

    resetForm();
    setShowCreatePost(false);
  };

  const resetForm = () => {
    setNewPost({
      title: '',
      description: '',
      image: '',
      category: '',
      materials: '',
      timeSpent: '',
      difficulty: 'Easy',
      tags: '',
      tips: ''
    });
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    likePost(postId, user.id);
  };

  const handleComment = (postId: string) => {
    if (!user || !newComment.trim()) return;
    
    addComment(postId, {
      user_id: user.id,
      author: {
        name: user.name,
        avatar: user.avatar || ''
      },
      content: newComment.trim()
    });
    
    setNewComment('');
  };

  const handleBookmark = (postId: string) => {
    if (!user) return;
    bookmarkPost(postId, user.id);
  };

  const handleEditPost = (post: any) => {
    setNewPost({
      title: post.title,
      description: post.description,
      image: post.image,
      category: post.category,
      materials: post.materials || '',
      timeSpent: post.timeSpent || '',
      difficulty: post.difficulty || 'Easy',
      tags: post.tags?.join(', ') || '',
      tips: post.tips || ''
    });
    setEditingPost(post);
    setShowCreatePost(true);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !categoryFilter || post.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes.length - a.likes.length;
        case 'comments':
          return b.comments.length - a.comments.length;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Mobile-Optimized Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 shadow-lg">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Community Showcase
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Share your amazing waste2wonder transformations and get inspired by others
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm sm:text-base font-semibold transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Share Your Creation
            </button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, materials, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="flex items-center justify-between mb-4 sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <span className="text-sm text-gray-500">{filteredPosts.length} posts</span>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setSortBy('recent');
                setShowFilters(false);
              }}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Enhanced Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getDifficultyColor(post.difficulty)}`}>
                    {post.difficulty}
                  </span>
                  {post.category && (
                    <span className="px-2 sm:px-3 py-1 text-xs font-bold rounded-full bg-blue-500 text-white shadow-lg">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* User Actions for Own Posts */}
                {post.user_id === user?.id && (
                  <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4 sm:p-5 lg:p-6">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-blue-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {post.author.name}
                      </span>
                      {post.author.role === 'creator' && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>

                {/* Post Content */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>

                {/* Post Details */}
                {post.materials && (
                  <div className="mb-3">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Materials:</h4>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{post.materials}</p>
                  </div>
                )}

                {post.timeSpent && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{post.timeSpent}</span>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Interaction Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-all duration-200 ${
                        post.likes?.includes(user?.id || '')
                          ? 'text-red-500 scale-110'
                          : 'text-gray-500 hover:text-red-500 hover:scale-110'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.likes?.includes(user?.id || '') ? 'fill-current' : ''}`} />
                      <span className="text-sm font-semibold">{post.likes?.length}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowComments(true);
                      }}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 hover:scale-110"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">{post.comments?.length}</span>
                    </button>
                    
                    <button className="text-gray-500 hover:text-green-500 transition-all duration-200 hover:scale-110 hidden sm:block">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`transition-all duration-200 hover:scale-110 ${
                      post.bookmarks?.includes(user?.id || '')
                        ? 'text-blue-500'
                        : 'text-gray-500 hover:text-blue-500'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${post.bookmarks?.includes(user?.id || '') ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || categoryFilter ? 'Try adjusting your search or filters' : 'Be the first to share your amazing creation!'}
            </p>
            <button
              onClick={() => {
                if (searchTerm || categoryFilter) {
                  setSearchTerm('');
                  setCategoryFilter('');
                } else {
                  setShowCreatePost(true);
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
            >
              {searchTerm || categoryFilter ? 'Clear Filters' : 'Share Your Creation'}
            </button>
          </div>
        )}

        {/* Enhanced Create/Edit Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingPost ? 'Edit Your Creation' : 'Share Your Creation'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleCreatePost} className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="Give your creation an amazing title..."
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newPost.description}
                      onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                      placeholder="Tell the story of your transformation - what inspired you, challenges you faced, and what you learned..."
                    />
                  </div>

                  {/* Category and Difficulty */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newPost.category}
                      onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={newPost.difficulty}
                      onChange={(e) => setNewPost(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Materials and Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Materials Used
                    </label>
                    <input
                      type="text"
                      value={newPost.materials}
                      onChange={(e) => setNewPost(prev => ({ ...prev, materials: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="e.g., Plastic bottles, cardboard, paint, glue..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Time Spent
                    </label>
                    <input
                      type="text"
                      value={newPost.timeSpent}
                      onChange={(e) => setNewPost(prev => ({ ...prev, timeSpent: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="e.g., 2 hours, 1 weekend, 3 days..."
                    />
                  </div>

                  {/* Tags */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newPost.tags}
                      onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="e.g., upcycling, DIY, eco-friendly, creative, handmade..."
                    />
                  </div>

                  {/* Tips */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tips & Advice
                    </label>
                    <textarea
                      rows={3}
                      value={newPost.tips}
                      onChange={(e) => setNewPost(prev => ({ ...prev, tips: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                      placeholder="Share any tips or advice for others who want to try this project..."
                    />
                  </div>

                  {/* Enhanced Image Upload */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Image *
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50 scale-105'
                          : newPost.image
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {newPost.image ? (
                        <div className="relative">
                          <img 
                            src={newPost.image} 
                            alt="Preview" 
                            className="max-h-60 sm:max-h-80 mx-auto rounded-xl shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="mt-4 text-gray-600">
                            <p className="font-semibold">Perfect! Your image looks great.</p>
                            <p className="text-sm">Click to change or drag a new one here</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            Upload Your Creation
                          </h3>
                          <p className="text-gray-500 mb-6 text-sm sm:text-base">
                            PNG, JPG, GIF up to 10MB • Show off your amazing transformation!
                          </p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
                          >
                            <Camera className="h-5 w-5 mr-2" />
                            Choose Image
                          </button>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    
                    {imageError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {imageError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreatePost(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center font-semibold"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {editingPost ? 'Update Post' : 'Share Creation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Comments Modal */}
        {showComments && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Comments</h3>
                    <p className="text-sm text-gray-500">{selectedPost.comments.length} comments</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowComments(false);
                      setSelectedPost(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {selectedPost.comments.map((comment: any) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ring-2 ring-gray-100"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl p-3 sm:p-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm sm:text-base text-gray-900">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedPost.comments.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No comments yet</p>
                      <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 rounded-b-2xl">
                <div className="flex space-x-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ring-2 ring-blue-100"
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a thoughtful comment..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(selectedPost.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleComment(selectedPost.id)}
                      disabled={!newComment.trim()}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      <Send className="h-4 w-4" />
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