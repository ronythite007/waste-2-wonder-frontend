import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { 
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle,
  Eye,
  Image as ImageIcon,
  Info,
  Leaf,
  Lightbulb,
  Loader,
  Package,
  Play,
  Sparkles,
  Target,
  Upload,
  Wrench,
  X,
  Zap
} from 'lucide-react';

export default function WasteUpload() {
  const { user, session } = useAuth();
  const { generateSuggestions, isUploading, setIsUploading } = useWaste();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSuggestion = async (suggestion: any) => {
    if (!user) {
      alert('Please login to save suggestions');
      return;
    }

    if (!session?.access_token) {
      alert('Authentication error. Please log in again.');
      return;
    }

    setSavingState(prev => ({ ...prev, [suggestion.id]: true }));

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/save-suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          suggestion,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save suggestion');
      }

      const data = await response.json();
      if (data.success) {
        alert('Suggestion saved successfully!');
      }
    } catch (error) {
      console.error('Error saving suggestion:', error);
      alert('Failed to save suggestion. Please try again.');
    } finally {
      setSavingState(prev => ({ ...prev, [suggestion.id]: false }));
    }
  };
  const [hasSelectedImage, setHasSelectedImage] = useState(false);
  
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    category: '',
    condition: 'Good',
    quantity: 1,
    location: '',
    dimensions: '',
    weight: '',
    color: '',
    material: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [savingState, setSavingState] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    timeRequired: string;
    tools: string[];
    materials: string[];
    estimatedCost: string;
    steps: string[];
    safetyTips: string[];
    ecoImpact: {
      co2Saved: number;
      wasteReduced: number;
      energySaved: number;
    };
    videoSearchQuery: string;
  }>>([]);

  const categories = [
    { 
      value: 'Plastic', 
      icon: '🥤', 
      description: 'Bottles, containers, bags, packaging',
      examples: ['Water bottles', 'Food containers', 'Shopping bags', 'Yogurt cups'],
      tips: 'Clean thoroughly before uploading. Check recycling codes for better suggestions.'
    },
    { 
      value: 'Paper', 
      icon: '📄', 
      description: 'Newspapers, cardboard, books, magazines',
      examples: ['Cardboard boxes', 'Old newspapers', 'Magazines', 'Paper bags'],
      tips: 'Ensure paper is dry and free from food residue for best upcycling options.'
    },
    { 
      value: 'Glass', 
      icon: '🍶', 
      description: 'Bottles, jars, containers, windows',
      examples: ['Wine bottles', 'Mason jars', 'Glass containers', 'Broken glass'],
      tips: 'Handle with care. Mention any cracks or chips in the description.'
    },
    { 
      value: 'Metal', 
      icon: '🔧', 
      description: 'Cans, tools, hardware, appliances',
      examples: ['Tin cans', 'Aluminum cans', 'Old tools', 'Metal scraps'],
      tips: 'Remove any rust or sharp edges. Specify the type of metal if known.'
    },
    { 
      value: 'Textile', 
      icon: '👕', 
      description: 'Clothes, fabric, accessories, shoes',
      examples: ['Old t-shirts', 'Jeans', 'Bed sheets', 'Curtains'],
      tips: 'Wash items before uploading. Mention fabric type and any stains or damage.'
    },
    { 
      value: 'Electronics', 
      icon: '📱', 
      description: 'Phones, computers, gadgets, cables',
      examples: ['Old phones', 'Laptops', 'Cables', 'Circuit boards'],
      tips: 'Remove personal data. Specify if item is working or broken.'
    },
    { 
      value: 'Wood', 
      icon: '🪵', 
      description: 'Furniture, pallets, lumber, branches',
      examples: ['Old furniture', 'Wooden pallets', 'Tree branches', 'Scrap wood'],
      tips: 'Check for nails or screws. Mention wood type and treatment if known.'
    },
    { 
      value: 'Organic', 
      icon: '🌿', 
      description: 'Food waste, garden waste, natural materials',
      examples: ['Fruit peels', 'Coffee grounds', 'Leaves', 'Eggshells'],
      tips: 'Best for composting and natural craft projects. Ensure freshness.'
    },
    { 
      value: 'Other', 
      icon: '📦', 
      description: 'Mixed materials or unique items',
      examples: ['Composite materials', 'Unique items', 'Mixed waste'],
      tips: 'Provide detailed description of all materials involved.'
    }
  ];

  const conditions = [
    { 
      value: 'Excellent', 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      description: 'Like new, no visible wear or damage',
      icon: '✨'
    },
    { 
      value: 'Good', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      description: 'Minor wear, fully functional',
      icon: '👍'
    },
    { 
      value: 'Fair', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50',
      description: 'Noticeable wear, may need minor repairs',
      icon: '⚠️'
    },
    { 
      value: 'Poor', 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      description: 'Significant damage, needs major work',
      icon: '🔧'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      description: 'Tell us about your waste item',
      icon: Info,
      fields: ['type', 'description', 'category']
    },
    {
      number: 2,
      title: 'Item Details',
      description: 'Provide specific details',
      icon: Eye,
      fields: ['condition', 'quantity', 'dimensions', 'weight', 'color', 'material']
    },
    {
      number: 3,
      title: 'Image & Location',
      description: 'Add photo and location',
      icon: Camera,
      fields: ['image', 'location']
    },
    {
      number: 4,
      title: 'Review & Submit',
      description: 'Review your information',
      icon: CheckCircle,
      fields: []
    },
    {
      number: 5,
      title: 'AI Suggestions',
      description: 'View personalized upcycling ideas',
      icon: Sparkles,
      fields: []
    }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.type.trim()) {
        newErrors.type = 'Waste type is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters for better AI suggestions';
      }
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
    }
    
    if (step === 2) {
      if (formData.quantity < 1) {
        newErrors.quantity = 'Quantity must be at least 1';
      }
      if (formData.dimensions && formData.dimensions.length < 5) {
        newErrors.dimensions = 'Please provide more detailed dimensions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }));
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }
    
    setErrors(prev => ({ ...prev, image: '' }));
    setLoading(true);
    setIsUploading(true);
    setHasSelectedImage(true);

    try {
      // Set preview first
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Create form data and send to backend
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-image`, {
        method: 'POST',
        body: formData,
        credentials: 'include'  // Important for session cookies
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }

      // Store image URL for later use
      setImageUrl(result.image_url);
      setUploadSuccess(true);
      setIsUploading(false);
      
      // Don't automatically move to next step, let user control navigation
    } catch (error) {
      console.error('Error analyzing image:', error);
      setErrors(prev => ({
        ...prev,
        image: error instanceof Error ? error.message : 'Failed to analyze image'
      }));
      setHasSelectedImage(false);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
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
    setImagePreview(null);
    setImageUrl(null);
    setUploadSuccess(false);
    setHasSelectedImage(false);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;

    // If we're on step 3 (image upload step)
    if (currentStep === 3) {
      // If an image is selected but still uploading, prevent proceeding
      if (hasSelectedImage && isUploading) {
        setErrors(prev => ({
          ...prev,
          image: 'Please wait for the image to finish uploading'
        }));
        return;
      }
    }

    // Only allow progression to step 4 after form submission
    if (currentStep <= 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validateStep(currentStep)) return;
    if (!imageUrl) {
      setErrors(prev => ({
        ...prev,
        submit: 'Please upload an image before submitting.'
      }));
      return;
    }

    setLoading(true);
    try {
      // Send to backend for suggestions
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formData: {
            description: formData.description,
            imageUrl,
            type: formData.type,
            category: formData.category,
            condition: formData.condition,
            quantity: formData.quantity,
            dimensions: formData.dimensions,
            weight: formData.weight,
            color: formData.color,
            material: formData.material,
            location: formData.location
          }
        }),
        credentials: 'include'  // This is important for session cookies
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate suggestions');
      }

      // Update suggestions in context
      generateSuggestions(result.suggestions);
      setSuggestions(result.suggestions);
      setSuccess(true);
      setCurrentStep(5); // Move to the suggestions step
      
    } catch (error) {
      console.error('Error uploading waste item:', error);
      setErrors({ submit: 'Failed to upload item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
            <Upload className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Transform Waste into Wonder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload your waste item with detailed information to get personalized AI-powered upcycling suggestions with step-by-step instructions.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 mt-1">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Success Message */}
          {success && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold">Item uploaded successfully!</h3>
                    <p className="text-green-100">Your waste item has been processed. Check below for AI-powered suggestions!</p>
                  </div>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-white hover:text-green-100 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Waste Type */}
                  <div className="lg:col-span-2">
                    <label htmlFor="type" className="block text-lg font-semibold text-gray-900 mb-3">
                      What type of waste item do you have? *
                    </label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                        errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Large plastic water bottle, Cardboard shipping box, Old cotton t-shirt"
                    />
                    {errors.type && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-3">
                      Detailed Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Provide detailed information: What is it? How was it used? What condition is it in? Any damage or wear? Size, color, brand, etc. The more details you provide, the better AI suggestions you'll receive!"
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.description ? (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.description}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {formData.description.length}/1000 characters (minimum 20 for better AI suggestions)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Select Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(category => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          formData.category === category.value
                            ? 'border-green-500 bg-green-50 text-green-700 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{category.value}</div>
                            <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                            <div className="text-xs text-gray-500 mt-2">
                              Examples: {category.examples.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Category Tips */}
                {selectedCategory && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Tips for {selectedCategory.value}</h4>
                        <p className="text-blue-800 text-sm mt-1">{selectedCategory.tips}</p>
                        <div className="mt-2">
                          <p className="text-xs text-blue-700 font-medium">Common examples:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedCategory.examples.map((example, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Item Details */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Condition */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Item Condition *
                    </label>
                    <div className="space-y-3">
                      {conditions.map(condition => (
                        <button
                          key={condition.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            formData.condition === condition.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{condition.icon}</span>
                            <div>
                              <div className={`font-semibold ${condition.color}`}>
                                {condition.value}
                              </div>
                              <div className="text-sm text-gray-600">
                                {condition.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-semibold text-gray-900 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="dimensions" className="block text-sm font-semibold text-gray-900 mb-2">
                        Dimensions (optional)
                      </label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 30cm x 20cm x 15cm"
                      />
                    </div>

                    <div>
                      <label htmlFor="weight" className="block text-sm font-semibold text-gray-900 mb-2">
                        Weight (optional)
                      </label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 500g, 2kg, Light, Heavy"
                      />
                    </div>

                    <div>
                      <label htmlFor="color" className="block text-sm font-semibold text-gray-900 mb-2">
                        Color (optional)
                      </label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Blue, Red, Transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="material" className="block text-sm font-semibold text-gray-900 mb-2">
                        Specific Material (optional)
                      </label>
                      <input
                        type="text"
                        id="material"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., PET plastic, Cotton, Oak wood"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Image & Location */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Image Upload */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Upload Image (Recommended for better AI suggestions)
                  </label>
                  
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-green-500 bg-green-50 scale-105'
                        : imagePreview
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-80 mx-auto rounded-xl shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <div className="mt-6 text-gray-600">
                          {uploadSuccess ? (
                            <>
                              <p className="font-medium text-green-600 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Image uploaded successfully!
                              </p>
                              <p className="text-sm mt-2">Click to change image or drag a new one here</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">Image preview ready</p>
                              <p className="text-sm">Click to change image or drag a new one here</p>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                          <ImageIcon className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Drop your image here, or click to browse
                        </h3>
                        <p className="text-gray-500 mb-6">
                          PNG, JPG, GIF up to 10MB • Images help our AI provide better suggestions
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Choose File
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
                  
                  {errors.image && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-lg font-semibold text-gray-900 mb-3">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., New York, NY or your city"
                  />
                  <p className="mt-2 text-sm text-gray-500 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    This helps others find your items in the marketplace and provides location-specific suggestions
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Eye className="h-6 w-6 mr-2 text-green-600" />
                    Review Your Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Item Type</h4>
                        <p className="text-gray-700">{formData.type}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">Category</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{selectedCategory?.icon}</span>
                          <span className="text-gray-700">{formData.category}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">Condition</h4>
                        <div className="flex items-center space-x-2">
                          <span>{conditions.find(c => c.value === formData.condition)?.icon}</span>
                          <span className="text-gray-700">{formData.condition}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">Quantity</h4>
                        <p className="text-gray-700">{formData.quantity}</p>
                      </div>
                      
                      {formData.dimensions && (
                        <div>
                          <h4 className="font-semibold text-gray-900">Dimensions</h4>
                          <p className="text-gray-700">{formData.dimensions}</p>
                        </div>
                      )}
                      
                      {formData.location && (
                        <div>
                          <h4 className="font-semibold text-gray-900">Location</h4>
                          <p className="text-gray-700">{formData.location}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-xl">
                        {formData.description}
                      </p>
                      
                      {imagePreview && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Image</h4>
                          <img 
                            src={imagePreview} 
                            alt="Item preview" 
                            className="w-full max-w-xs rounded-xl shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    What happens after you submit?
                  </h4>
                  <div className="space-y-3 text-sm text-blue-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                        <Zap className="h-3 w-3" />
                      </div>
                      <p>Our AI analyzes your item details and image to understand the material and condition</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                        <Target className="h-3 w-3" />
                      </div>
                      <p>Generate personalized upcycling suggestions with step-by-step instructions</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                        <BookOpen className="h-3 w-3" />
                      </div>
                      <p>Provide tool lists, material requirements, and difficulty levels for each project</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                        <Play className="h-3 w-3" />
                      </div>
                      <p>Link to relevant YouTube tutorials and additional resources</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: AI Suggestions */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles className="h-7 w-7 mr-3 text-green-600" />
                    AI-Powered Upcycling Suggestions
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {suggestions.map(suggestion => (
                      <div 
                        key={suggestion.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                          <h4 className="text-xl font-bold text-white mb-1">{suggestion.title}</h4>
                          <div className="flex items-center space-x-4">
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                              {suggestion.difficulty}
                            </span>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                              {suggestion.timeRequired}
                            </span>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                              {suggestion.estimatedCost}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <p className="text-gray-700">{suggestion.description}</p>
                          
                          {/* Tools and Materials */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">Tools Needed:</h5>
                              <ul className="space-y-1">
                                {suggestion.tools.map((tool, index) => (
                                  <li key={index} className="text-gray-600 text-sm flex items-center">
                                    <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                                    {tool}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">Materials:</h5>
                              <ul className="space-y-1">
                                {suggestion.materials.map((material, index) => (
                                  <li key={index} className="text-gray-600 text-sm flex items-center">
                                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                                    {material}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {/* Steps */}
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Steps:</h5>
                            <ol className="space-y-2">
                              {suggestion.steps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-600 text-sm">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          
                          {/* Safety Tips */}
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Safety Tips:
                            </h5>
                            <ul className="space-y-1">
                              {suggestion.safetyTips.map((tip, index) => (
                                <li key={index} className="text-yellow-700 text-sm flex items-start">
                                  <span className="mr-2">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Eco Impact */}
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                              <Leaf className="h-4 w-4 mr-2" />
                              Environmental Impact:
                            </h5>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <div className="text-green-600 font-bold">{suggestion.ecoImpact.co2Saved}kg</div>
                                <div className="text-green-700 text-xs">CO₂ Saved</div>
                              </div>
                              <div>
                                <div className="text-green-600 font-bold">{suggestion.ecoImpact.wasteReduced}kg</div>
                                <div className="text-green-700 text-xs">Waste Reduced</div>
                              </div>
                              <div>
                                <div className="text-green-600 font-bold">{suggestion.ecoImpact.energySaved}kWh</div>
                                <div className="text-green-700 text-xs">Energy Saved</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {/* Video Tutorial Link */}
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(suggestion.videoSearchQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Watch Tutorial Videos
                            </a>

                            {/* Save Suggestion Button */}
                            <button
                              type="button"
                              onClick={() => handleSaveSuggestion(suggestion)}
                              disabled={savingState[suggestion.id]}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {savingState[suggestion.id] ? (
                                <>
                                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Save to My Projects
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Previous
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-3 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide' : 'Preview'}
                </button>

                {currentStep <= 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center shadow-lg"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Submit Item
                        <Sparkles className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Current Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Type:</span> {formData.type || 'Not specified'}</p>
                  <p><span className="font-medium">Category:</span> {formData.category || 'Not selected'}</p>
                  <p><span className="font-medium">Condition:</span> {formData.condition}</p>
                  <p><span className="font-medium">Quantity:</span> {formData.quantity}</p>
                  {formData.dimensions && <p><span className="font-medium">Dimensions:</span> {formData.dimensions}</p>}
                  {formData.location && <p><span className="font-medium">Location:</span> {formData.location}</p>}
                </div>
              </div>
              <div>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-full max-w-xs rounded-lg shadow-md" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Our advanced AI analyzes your waste item details and image to provide personalized upcycling suggestions with detailed step-by-step instructions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Detailed Instructions
                </h3>
                <p className="text-gray-600 text-sm">
                  Get comprehensive project guides including required tools, materials, time estimates, and difficulty levels for each suggestion.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Video Tutorials
                </h3>
                <p className="text-gray-600 text-sm">
                  Access curated YouTube tutorials and additional resources to help you complete your upcycling projects successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}