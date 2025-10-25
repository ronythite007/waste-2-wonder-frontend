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
  Trash2
} from 'lucide-react';

export default function Marketplace() {
  const { user } = useAuth();
  const { products, addProduct, searchProducts, updateProduct, deleteProduct } = useMarketplace();
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productImageError, setProductImageError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    condition: 'New' as const,
    type: 'Sale' as const,
    image: '',
    dimensions: '',
    weight: '',
    color: '',
    material: '',
    location: '',
    tags: '',
    shippingInfo: '',
    returnPolicy: ''
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
    'Other'
  ];
  
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const priceRanges = ['Under $25', '$25-$50', '$50-$100', '$100-$200', 'Over $200'];

  const handleProductImageUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setProductImageError('Image size must be less than 10MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setProductImageError('Please select a valid image file');
      return;
    }
    
    setProductImageError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewProduct(prev => ({ ...prev, image: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProductImageUpload(file);
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
      handleProductImageUpload(file);
    }
  };

  const removeProductImage = () => {
    setNewProduct(prev => ({ ...prev, image: '' }));
    setProductImageError('');
    if (productFileInputRef.current) {
      productFileInputRef.current.value = '';
    }
  };

  const filteredProducts = products.filter(product => {
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
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const productData = {
      ...newProduct,
      userId: user.id,
      image: newProduct.image || 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=500',
      tags: newProduct.tags.split(',').map(tag => tag.trim()).join(','),
      seller: {
        name: user.name,
        avatar: user.avatar || '',
        rating: 4.5,
        joinDate: user.joinDate,
        totalSales: Math.floor(Math.random() * 50) + 1
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
      image: '',
      dimensions: '',
      weight: '',
      color: '',
      material: '',
      location: '',
      tags: '',
      shippingInfo: '',
      returnPolicy: ''
    });
    setProductImageError('');
    if (productFileInputRef.current) {
      productFileInputRef.current.value = '';
    }
  };

  const handleEditProduct = (product: any) => {
    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      type: product.type,
      image: product.image,
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      color: product.color || '',
      material: product.material || '',
      location: product.location || '',
      tags: product.tags || '',
      shippingInfo: product.shippingInfo || '',
      returnPolicy: product.returnPolicy || ''
    });
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
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

  const ProductDetailModal = ({ product, onClose }: { product: any, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-80 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              product.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {product.type}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getConditionColor(product.condition)}`}>
              {product.condition}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <div className="text-right">
                  {product.type === 'Sale' ? (
                    <div className="text-3xl font-bold text-green-600">${product.price}</div>
                  ) : (
                    <div className="text-xl font-semibold text-blue-600">Free</div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                  <p className="text-gray-700">{product.category}</p>
                </div>
                {product.dimensions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Dimensions</h3>
                    <p className="text-gray-700">{product.dimensions}</p>
                  </div>
                )}
                {product.weight && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Weight</h3>
                    <p className="text-gray-700">{product.weight}</p>
                  </div>
                )}
                {product.material && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Material</h3>
                    <p className="text-gray-700">{product.material}</p>
                  </div>
                )}
              </div>

              {product.tags && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(',').map((tag: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.shippingInfo && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h3>
                  <p className="text-gray-700">{product.shippingInfo}</p>
                </div>
              )}

              {product.returnPolicy && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Return Policy
                  </h3>
                  <p className="text-gray-700">{product.returnPolicy}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-4">
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.seller.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.seller.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">({product.seller.totalSales} sales)</span>
                    </div>
                  </div>
                </div>

                {product.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{product.location}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    {product.type === 'Sale' ? 'Buy Now' : 'Request Item'}
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Seller
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Save to Favorites
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Buyer Protection
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Truck className="h-4 w-4 mr-2" />
                    Secure Shipping
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Listed {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingBag className="h-8 w-8 mr-3 text-purple-600" />
              Marketplace
            </h1>
            <p className="mt-2 text-gray-600">
              Buy and sell beautiful upcycled decor items from the community
            </p>
          </div>
          
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            List Your Item
          </button>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, materials, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Types</option>
              <option value="Sale">For Sale</option>
              <option value="Donation">Free</option>
            </select>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Prices</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    product.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.type}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getConditionColor(product.condition)}`}>
                    {product.condition}
                  </span>
                </div>
                <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-gray-400" />
                </button>
                {product.userId === user?.id && (
                  <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-5">
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
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {product.category}
                  </span>
                  {product.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {product.location}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{product.seller.name}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">{product.seller.rating}</span>
                    </div>
                  </div>
                </div>

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
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setTypeFilter('');
                setPriceFilter('');
                setConditionFilter('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
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
                
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.title}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Handcrafted Wooden Plant Stand"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Describe your item in detail - materials used, dimensions, condition, unique features..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition *
                      </label>
                      <select
                        value={newProduct.condition}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, condition: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        value={newProduct.type}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="Sale">For Sale</option>
                        <option value="Donation">Free (Donation)</option>
                      </select>
                    </div>

                    {newProduct.type === 'Sale' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required={newProduct.type === 'Sale'}
                          value={newProduct.price}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={newProduct.dimensions}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, dimensions: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 30cm x 20cm x 15cm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, weight: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 2kg or Light"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        value={newProduct.color}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Natural wood, White, Multi-color"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        value={newProduct.material}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, material: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Reclaimed wood, Upcycled plastic, Metal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newProduct.location}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., New York, NY"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProduct.tags}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., handmade, eco-friendly, vintage, rustic"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image *
                      </label>
                      <div className="space-y-4">
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                            dragActive
                              ? 'border-purple-500 bg-purple-50 scale-105'
                              : newProduct.image
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          {newProduct.image ? (
                            <div className="relative">
                              <img 
                                src={newProduct.image} 
                                alt="Product preview" 
                                className="max-h-60 mx-auto rounded-lg shadow-md"
                              />
                              <button
                                type="button"
                                onClick={removeProductImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <div className="mt-4 text-gray-600">
                                <p className="font-medium">Image uploaded successfully!</p>
                                <p className="text-sm">Click to change image or drag a new one here</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                                <Camera className="h-8 w-8 text-purple-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Upload Product Image
                              </h3>
                              <p className="text-gray-500 mb-4">
                                PNG, JPG, GIF up to 10MB • High-quality images get more views
                              </p>
                              <button
                                type="button"
                                onClick={() => productFileInputRef.current?.click()}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Choose Image
                              </button>
                            </div>
                          )}
                          
                          <input
                            ref={productFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProductImageSelect}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        
                        {productImageError && (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {productImageError}
                          </p>
                        )}
                      </div>
                    </div>

                    {newProduct.type === 'Sale' && (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shipping Information
                          </label>
                          <textarea
                            rows={2}
                            value={newProduct.shippingInfo}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, shippingInfo: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g., Free local pickup, $15 shipping nationwide, Buyer pays shipping"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Policy
                          </label>
                          <textarea
                            rows={2}
                            value={newProduct.returnPolicy}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, returnPolicy: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g., 7-day return policy, No returns on custom items, Returns accepted if not as described"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProduct(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center"
                    >
                      {editingProduct ? 'Update Product' : 'List Product'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {showProductDetail && selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => {
              setShowProductDetail(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}