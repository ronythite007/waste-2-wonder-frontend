import {} from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Globe, Users, ArrowRight, Sparkles, Wand2, ShoppingBag, Shield } from 'lucide-react';
import Chatbot from './Chatbot';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Chatbot */}
      <Chatbot />
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1">
              <img
                src="/logo.png"
                alt="Waste2Wonder"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="ml-2 text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Waste2Wonder</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/login?mode=signup')}
                className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-green-600 hover:text-green-700 font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-green-400/30 to-blue-400/30 blur-3xl"></div>
        <div aria-hidden className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/30 to-teal-400/30 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-24 pb-16 md:pt-32 md:pb-24 lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Left column */}
            <div className="lg:col-span-6 xl:col-span-7 lg:self-center">
              <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 ring-1 ring-green-200">
                Sustainable by Design
              </p>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Turn everyday waste into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">remarkable creations</span>
              </h1>
              <p className="mt-4 text-gray-600 text-lg md:text-xl max-w-2xl">
                Discover AI-guided ideas, step-by-step tutorials, and a community marketplace to bring your eco-friendly visions to life.
              </p>

              {/* Stats with separators */}
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">5k+</div>
                  <div className="text-sm text-gray-500">Makers</div>
                </div>
                <div className="text-center border-l border-gray-200">
                  <div className="text-3xl font-bold text-blue-600">10k+</div>
                  <div className="text-sm text-gray-500">Projects</div>
                </div>
                <div className="text-center border-l border-gray-200">
                  <div className="text-3xl font-bold text-emerald-600">50t</div>
                  <div className="text-sm text-gray-500">Waste Saved</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/login?mode=signup')}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-xl text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg shadow-emerald-200/40"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Explore First
                </button>
              </div>
            </div>

            {/* Right column removed as requested */}
          </div>
        </div>
      </div>

      {/* Creator Toolkit (replaces Inspiration Gallery) */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Creator Toolkit</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Everything you need to go from waste to wow — guided ideas, step-by-step help, and a place to share or sell.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Ideas</h3>
              <p className="text-gray-600 text-sm">Personalized concepts for your exact materials, difficulty level, and time.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center mb-4">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Guided Tutorials</h3>
              <p className="text-gray-600 text-sm">Clear steps, tools, and tips — plus links to the best video walkthroughs.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Community Feedback</h3>
              <p className="text-gray-600 text-sm">Share progress, get encouragement, and learn from fellow upcyclers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Sell or Share</h3>
              <p className="text-gray-600 text-sm">List your creations in the marketplace or gift them to the community.</p>
            </div>
          </div>

          <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-white ring-1 ring-gray-100 shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <p className="text-gray-700 text-sm sm:text-base">Sustainable-first, privacy-respecting, and community-moderated platform.</p>
            </div>
            <button onClick={() => navigate('/login?mode=signup')} className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Start Creating</button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <div className="py-24 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">Why Choose Us</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">A Better Way to Upcycle</p>
            <p className="mt-3 max-w-2xl text-lg sm:text-xl text-gray-600 lg:mx-auto">Discover endless possibilities for sustainable creation with AI-guided ideas, a supportive community, and a marketplace to share your work.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-emerald-200 to-blue-200">
              <div className="h-full p-6 rounded-2xl bg-white shadow-xl">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-5">
                  <Leaf className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Eco-friendly Projects</h3>
                <p className="text-gray-600">Transform everyday waste into useful, beautiful items with curated project ideas.</p>
              </div>
            </div>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200">
              <div className="h-full p-6 rounded-2xl bg-white shadow-xl">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-5">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Community Support</h3>
                <p className="text-gray-600">Learn, share, and grow with a friendly, purpose-driven community.</p>
              </div>
            </div>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-200">
              <div className="h-full p-6 rounded-2xl bg-white shadow-xl">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 mb-5">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Track Impact</h3>
                <p className="text-gray-600">Visualize your CO₂ savings and waste reduction over time.</p>
              </div>
            </div>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200">
              <div className="h-full p-6 rounded-2xl bg-white shadow-xl">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-5">
                  <img src="/logo.png" alt="logo" className="h-7 w-7 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Marketplace</h3>
                <p className="text-gray-600">Sell or share your creations in a sustainable marketplace.</p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-24">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
                <div className="absolute -top-3 left-6">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">Step 1</div>
                </div>
                <h3 className="mt-2 text-xl font-bold">Upload Waste</h3>
                <p className="mt-2 text-gray-600">Snap or drag-and-drop your materials. We’ll detect types and surface the best ideas.</p>
                <div className="mt-4 h-1 w-24 bg-gradient-to-r from-emerald-400 to-blue-400 rounded"></div>
              </div>

              <div className="relative p-6 rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
                <div className="absolute -top-3 left-6">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 ring-1 ring-blue-200">Step 2</div>
                </div>
                <h3 className="mt-2 text-xl font-bold">Transform</h3>
                <p className="mt-2 text-gray-600">Follow clear, actionable guides with tool lists, difficulty, and time estimates.</p>
                <div className="mt-4 h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded"></div>
              </div>

              <div className="relative p-6 rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
                <div className="absolute -top-3 left-6">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 ring-1 ring-purple-200">Step 3</div>
                </div>
                <h3 className="mt-2 text-xl font-bold">Share & Earn</h3>
                <p className="mt-2 text-gray-600">Showcase your creation, get feedback, and list it on the marketplace.</p>
                <div className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative p-8 rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
              <div className="absolute -top-4 -left-4 text-emerald-200 text-6xl select-none">“</div>
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" alt="Rohan" />
                <div className="ml-4">
                  <h4 className="text-base font-semibold">Rohan</h4>
                  <p className="text-emerald-600 text-sm">Artist</p>
                </div>
              </div>
              <p className="text-gray-700">Waste2Wonder changed how I view waste. Now every scrap feels like a starting point for something beautiful.</p>
              <div className="mt-4 flex text-amber-400">★★★★★</div>
            </div>
            <div className="relative p-8 rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
              <div className="absolute -top-4 -left-4 text-blue-200 text-6xl select-none">“</div>
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik" alt="Pratik" />
                <div className="ml-4">
                  <h4 className="text-base font-semibold">Pratik</h4>
                  <p className="text-blue-600 text-sm">DIY Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-700">Amazing community and tips. I’ve learned new techniques and stayed motivated to keep creating.</p>
              <div className="mt-4 flex text-amber-400">★★★★★</div>
            </div>
            <div className="relative p-8 rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
              <div className="absolute -top-4 -left-4 text-purple-200 text-6xl select-none">“</div>
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sourabh" alt="Sourabh" />
                <div className="ml-4">
                  <h4 className="text-base font-semibold">Sourabh</h4>
                  <p className="text-purple-600 text-sm">Eco-Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-700">Started as a hobby. Now I sell my upcycles in the marketplace — real customers, real impact.</p>
              <div className="mt-4 flex text-amber-400">★★★★★</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute left-0 bottom-0 -mb-4 -ml-4 w-48 h-48 bg-white opacity-10 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 relative">
          <div className="bg-white/10 p-8 md:p-12 rounded-2xl backdrop-blur-sm">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to Make a Difference?</span>
                  <span className="block text-green-200">Join Waste2Wonder Today</span>
                </h2>
                <p className="mt-4 text-lg text-green-100">
                  Start your journey towards sustainable creativity and join thousands of eco-conscious makers in our community.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-end">
                <button
                  onClick={() => navigate('/login?mode=signup')}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-green-600 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Landing;