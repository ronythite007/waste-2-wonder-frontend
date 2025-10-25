import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Heart,
  MapPin,
  DollarSign,
  Eye,
  MessageCircle,
  Camera,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Package,
  Truck,
  Shield,
  ArrowRight,
  Edit,
  Trash2,
  Upload,
  Award,
  TrendingUp,
  ThumbsUp,
  Flag,
  Share2,
  Bookmark,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  Image as ImageIcon,
  StarIcon
} from 'lucide-react';

export default function EnhancedMarketplace() {
  const { user } = useAuth();
  const { products, addProduct, searchProducts, updateProduct, deleteProduct } = useMarketplace();
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productImageError, setProductImageError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    condition: 'New' as const,
    type: 'Sale' as const,
    image: [] as string[],
    dimensions: '',
    weight: '',
    color: '',
    material: '',
    location: '',
    tags: '',
    shipping_info: '',
    return_policy: '',
  });

  const categories = [
    'Garden & Plants', 
    'Furniture', 
    'Home Decor', 
    'Lighting', 
    'Storage & Organization',
    'Wall Art', 
    'Kitchen & Dining',
    'Bathroom',
    'Outdoor',
    'Seasonal',
    'Kids & Baby',
    'Electronics',
    'Textiles',
    'Tools & Hardware',
    'Other'
  ];
  
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const priceRanges = ['Under $25', '$25-$50', '$50-$100', '$100-$200', 'Over $200'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Enhanced product data with ratings and reviews
  const enhancedProducts = products.map(product => ({
    ...product,
    rating: 4.2 + Math.random() * 0.8, // Mock rating between 4.2-5.0
    reviewCount: Math.floor(Math.random() * 50) + 1,
    views: Math.floor(Math.random() * 200) + 10,
    likes: Math.floor(Math.random() * 30) + 1,
    isVerifiedSeller: Math.random() > 0.3,
    responseTime: Math.floor(Math.random() * 24) + 1 + ' hours',
    shippingTime: Math.floor(Math.random() * 7) + 1 + ' days'
  }));

  const handleMultipleImageUpload = (files: FileList) => {
    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setProductImageError('Each image must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setProductImageError('Please select valid image files');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        if (newImages.length === files.length) {
          setProductImages(prev => [...prev, ...newImages]);
          setNewProduct(prev => ({ ...prev, image: [...prev.image, ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    });
    setProductImageError('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleMultipleImageUpload(files);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setNewProduct(prev => ({ 
      ...prev, 
      image: prev.image.filter((_, i) => i !== index) 
    }));
  };

  const filteredProducts = enhancedProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesType = !typeFilter || product.type === typeFilter;
    const matchesCondition = !conditionFilter || product.condition === conditionFilter;
    
    let matchesPrice = true;
    if (priceFilter && product.type === 'Sale') {
      switch (priceFilter) {
        case 'Under $25':
          matchesPrice = product.price < 25;
          break;
        case '$25-$50':
          matchesPrice = product.price >= 25 && product.price <= 50;
          break;
        case '$50-$100':
          matchesPrice = product.price >= 50 && product.price <= 100;
          break;
        case '$100-$200':
          matchesPrice = product.price >= 100 && product.price <= 200;
          break;
        case 'Over $200':
          matchesPrice = product.price > 200;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesCondition && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.views - a.views;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const productData = {
      ...newProduct,
      user_id: user.id,
      image: productImages.length > 0 ? productImages : ['https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=500'],
      tags: newProduct.tags.split(',').map(tag => tag.trim()).join(','),
      seller_info: {
        name: user.profile?.name || user.email?.split('@')[0] || 'Unknown',
        avatar: user.profile?.avatar || '',
        rating: 4.5,
        joinDate: user.profile?.join_date || new Date().toISOString(),
        totalSales: Math.floor(Math.random() * 50) + 1,
        isVerified: user.profile?.role === 'creator'
      }
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    resetForm();
    setShowAddProduct(false);
  };

  const resetForm = () => {
    setNewProduct({
      title: '',
      description: '',
      price: 0,
      category: '',
      condition: 'New',
      type: 'Sale',
      image: [],
      dimensions: '',
      weight: '',
      color: '',
      material: '',
      location: '',
      tags: '',
      shipping_info: '',
      return_policy: ''
     });
    setProductImages([]);
    setProductImageError('');
    if (productFileInputRef.current) {
      productFileInputRef.current.value = '';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Like New': return 'bg-blue-100 text-blue-800';
      case 'Good': return 'bg-yellow-100 text-yellow-800';
      case 'Fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center mb-2">
              <ShoppingBag className="h-10 w-10 mr-4 text-purple-600" />
              Marketplace
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing upcycled creations from our community of makers
            </p>
            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
              <span>{filteredProducts.length} products available</span>
              <span>•</span>
              <span>Trusted sellers</span>
              <span>•</span>
              <span>Secure transactions</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              List Your Item
            </button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, materials, or creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                <option value="Sale">For Sale</option>
                <option value="Donation">Free</option>
              </select>
              
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
              
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Prices</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setTypeFilter('');
                  setPriceFilter('');
                  setConditionFilter('');
                  setSortBy('newest');
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-6"
        }>
          {filteredProducts.map(product => (
            <div key={product.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
              viewMode === 'list' ? 'flex' : ''
            }`}>
              <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === 'list' ? 'w-full h-48' : 'w-full h-56'
                  }`}
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                    product.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.type}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getConditionColor(product.condition)}`}>
                    {product.condition}
                  </span>
                </div>

                {/* Seller Verification Badge */}
                {product.isVerifiedSeller && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-blue-600 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute bottom-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                {/* Product Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="text-right ml-3">
                    {product.type === 'Sale' ? (
                      <span className="text-xl font-bold text-green-600">
                        ${product.price}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-blue-600">
                        Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Product Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {product.views}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {product.likes}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Seller Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={product.seller_info?.avatar || ''}
                    alt={product.seller_info?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        {product.seller_info?.name}
                      </span>
                      {product.isVerifiedSeller && (
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Responds in {product.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductDetail(true);
                    }}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || categoryFilter || typeFilter || priceFilter || conditionFilter 
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.' 
                : 'Be the first to list an amazing upcycled creation!'}
            </p>
            <div className="flex justify-center space-x-4">
              {(searchTerm || categoryFilter || typeFilter || priceFilter || conditionFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setTypeFilter('');
                    setPriceFilter('');
                    setConditionFilter('');
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium"
              >
                List Your First Item
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'List New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleAddProduct} className="p-6 space-y-8">
                {/* Multiple Image Upload */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Product Images (Up to 5 images) *
                  </label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Product ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {productImages.length < 5 && (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                        onClick={() => productFileInputRef.current?.click()}
                      >
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Add Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={productFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  
                  {productImageError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {productImageError}
                    </p>
                  )}
                </div>

                {/* Rest of the form fields remain the same but with enhanced styling */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.title}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Handcrafted Wooden Plant Stand from Reclaimed Wood"
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
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      placeholder="Describe your item in detail - materials used, dimensions, condition, unique features, and the story behind its creation..."
                    />
                  </div>

                  {/* Category and Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Type *
                    </label>
                    <select
                      value={newProduct.type}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Sale">For Sale</option>
                      <option value="Donation">Free (Donation)</option>
                    </select>
                  </div>

                  {/* Condition and Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Condition *
                    </label>
                    <select
                      value={newProduct.condition}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, condition: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>

                  {newProduct.type === 'Sale' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required={newProduct.type === 'Sale'}
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center font-medium"
                  >
                    {editingProduct ? 'Update Product' : 'List Product'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}